// index-upload.js
// Handles video upload, annotation, storage, and UI updates for index-upload.html

// --- DOM Elements ---
const videoUpload = document.getElementById('videoUpload');
const resolutionSelect = document.getElementById('resolutionSelect');
const processBtn = document.getElementById('processBtn');
const statusDiv = document.getElementById('status');
const previewSection = document.getElementById('previewSection');
const annotatedVideo = document.getElementById('annotatedVideo');
const videosTable = document.getElementById('videosTable').querySelector('tbody');
const previewModal = document.getElementById('previewModal');
const modalVideo = document.getElementById('modalVideo');
const modalClose = previewModal.querySelector('.modal-close');

// --- Globals ---
let cocoSsdModel = null;
let uploadedFile = null;
let annotatedBlob = null;
let annotationLog = null;
let annotatedMeta = null;

// --- Resolution Map ---
const RESOLUTIONS = {
    '144': { width: 256, height: 144 },
    '240': { width: 426, height: 240 },
    '360': { width: 640, height: 360 },
    '480': { width: 854, height: 480 },
    '720': { width: 1280, height: 720 }
};

// --- Load COCO-SSD Model ---
(async function loadModel() {
    statusDiv.textContent = 'Loading COCO-SSD model...';
    cocoSsdModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
    statusDiv.textContent = 'Model loaded. Ready to annotate.';
})();

// --- Video Upload Handler ---
videoUpload.addEventListener('change', e => {
    uploadedFile = e.target.files[0] || null;
    processBtn.disabled = !uploadedFile;
    previewSection.style.display = 'none';
    annotatedBlob = null;
    annotationLog = null;
    annotatedMeta = null;
});

// --- Process Button Handler ---
processBtn.addEventListener('click', async () => {
    if (!uploadedFile || !cocoSsdModel) return;
    processBtn.disabled = true;
    statusDiv.textContent = 'Processing video...';
    try {
        const resKey = resolutionSelect.value;
        const { width, height } = RESOLUTIONS[resKey];
        const { blob, log, meta } = await annotateVideo(uploadedFile, width, height);
        annotatedBlob = blob;
        annotationLog = log;
        annotatedMeta = meta;
        // Preview
        annotatedVideo.src = URL.createObjectURL(blob);
        previewSection.style.display = '';
        // Store in IndexedDB
        await saveAnnotatedVideoToIndexedDB(blob, log, meta);
        statusDiv.textContent = 'Annotation complete!';
        loadStoredVideos();
    } catch (err) {
        statusDiv.textContent = 'Error: ' + err.message;
        console.error(err);
    } finally {
        processBtn.disabled = false;
    }
});

// --- Annotate Video Function ---
async function annotateVideo(file, width, height) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.preload = 'auto';
        video.onloadedmetadata = async () => {
            const duration = video.duration;
            const fps = 10; // Reasonable for annotation
            const totalFrames = Math.floor(duration * fps);
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            const stream = canvas.captureStream(fps);
            const recordedChunks = [];
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
            let log = [];
            let allClasses = new Set();
            let frameIdx = 0;
            mediaRecorder.start();
            video.currentTime = 0;
            // Frame processing loop
            async function processFrame() {
                if (video.currentTime >= duration || frameIdx >= totalFrames) {
                    mediaRecorder.stop();
                    return;
                }
                ctx.drawImage(video, 0, 0, width, height);
                const predictions = await cocoSsdModel.detect(canvas);
                predictions.forEach(pred => {
                    // Draw box
                    ctx.strokeStyle = '#00FF00';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(...pred.bbox);
                    ctx.font = '14px Arial';
                    ctx.fillStyle = '#00FF00';
                    ctx.fillText(pred.class, pred.bbox[0], pred.bbox[1] > 10 ? pred.bbox[1] - 5 : 10);
                    allClasses.add(pred.class);
                });
                log.push({
                    frame: frameIdx,
                    time: video.currentTime,
                    predictions: predictions.map(p => ({ class: p.class, bbox: p.bbox, score: p.score }))
                });
                // Advance
                frameIdx++;
                video.currentTime = frameIdx / fps;
            }
            video.ontimeupdate = async () => {
                await processFrame();
            };
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const meta = {
                    length: duration,
                    resolution: `${width}x${height}`,
                    numObjects: allClasses.size,
                    classes: Array.from(allClasses)
                };
                resolve({ blob, log, meta });
            };
            video.onerror = err => reject(new Error('Video load error'));
        };
        video.onerror = err => reject(new Error('Video load error'));
    });
}

// --- IndexedDB Storage ---
function saveAnnotatedVideoToIndexedDB(blob, log, meta) {
    return new Promise((resolve, reject) => {
        const dbName = 'annotatedVideosDB';
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore('videos', { keyPath: 'id', autoIncrement: true });
        };
        request.onsuccess = event => {
            const db = event.target.result;
            const tx = db.transaction(['videos'], 'readwrite');
            const store = tx.objectStore('videos');
            store.add({
                video: blob,
                log,
                meta,
                timestamp: new Date()
            });
            tx.oncomplete = () => resolve();
            tx.onerror = err => reject(err);
        };
        request.onerror = event => reject(event.target.errorCode);
    });
}

// --- Load & Render Stored Videos Table ---
function loadStoredVideos() {
    const dbName = 'annotatedVideosDB';
    const request = indexedDB.open(dbName, 1);
    request.onsuccess = event => {
        const db = event.target.result;
        const tx = db.transaction(['videos'], 'readonly');
        const store = tx.objectStore('videos');
        const getAll = store.getAll();
        getAll.onsuccess = () => {
            const videos = getAll.result;
            renderVideosTable(videos);
            if (!videos || videos.length === 0) {
                videosTable.innerHTML = '<tr><td colspan="7" class="has-text-centered">No annotated videos found.</td></tr>';
            }
        };
        getAll.onerror = () => {
            videosTable.innerHTML = '<tr><td colspan="7" class="has-text-centered has-text-danger">Error loading videos from storage.</td></tr>';
        };
    };
    request.onerror = () => {
        videosTable.innerHTML = '<tr><td colspan="7" class="has-text-centered has-text-danger">Error opening IndexedDB.</td></tr>';
    };
}

function renderVideosTable(videos) {
    videosTable.innerHTML = '';
    if (!videos || videos.length === 0) return;
    videos.forEach((entry, idx) => {
        const tr = document.createElement('tr');
        const len = entry.meta && entry.meta.length ? entry.meta.length : 0;
        const mmss = len ? `${String(Math.floor(len/60)).padStart(2,'0')}:${String(Math.floor(len%60)).padStart(2,'0')}` : '';
        const res = entry.meta && entry.meta.resolution ? entry.meta.resolution : '';
        const nObj = entry.meta && entry.meta.numObjects ? entry.meta.numObjects : '';
        tr.innerHTML = `
            <td>${mmss}</td>
            <td>${res}</td>
            <td>${nObj}</td>
            <td><button class="button is-link is-small" data-idx="${idx}" data-action="log">Log</button></td>
            <td><button class="button is-info is-small" data-idx="${idx}" data-action="video">Video</button></td>
            <td><button class="button is-danger is-small" data-idx="${idx}" data-action="delete">Delete</button></td>
            <td><button class="button is-primary is-small" data-idx="${idx}" data-action="preview">Preview</button></td>
        `;
        videosTable.appendChild(tr);
    });
    // Add event listeners
    videosTable.querySelectorAll('button[data-action]').forEach(btn => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const action = btn.getAttribute('data-action');
        btn.onclick = () => handleTableAction(action, idx);
    });
}

function handleTableAction(action, idx) {
    // Reload videos from DB to get up-to-date
    const dbName = 'annotatedVideosDB';
    const request = indexedDB.open(dbName, 1);
    request.onsuccess = event => {
        const db = event.target.result;
        const tx = db.transaction(['videos'], 'readonly');
        const store = tx.objectStore('videos');
        const getAll = store.getAll();
        getAll.onsuccess = () => {
            const videos = getAll.result;
            const entry = videos[idx];
            if (!entry) return;
            if (action === 'log') {
                // Download log as JSON
                const blob = new Blob([JSON.stringify(entry.log, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'coco-ssd-log.json';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
            } else if (action === 'video') {
                // Download video
                const url = URL.createObjectURL(entry.video);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'annotated-video.webm';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
            } else if (action === 'delete') {
                // Delete from DB
                const delTx = db.transaction(['videos'], 'readwrite');
                const store2 = delTx.objectStore('videos');
                store2.delete(entry.id);
                delTx.oncomplete = () => loadStoredVideos();
            } else if (action === 'preview') {
                // Show modal with video
                modalVideo.src = URL.createObjectURL(entry.video);
                previewModal.classList.add('is-active');
            }
        };
    };
}

// --- Modal Logic ---

function closeModal() {
    previewModal.classList.remove('is-active');
    modalVideo.pause();
    modalVideo.src = '';
}
modalClose.onclick = closeModal;
previewModal.querySelector('.modal-background').onclick = closeModal;
// Close modal on ESC
window.addEventListener('keydown', e => {
    if (previewModal.classList.contains('is-active') && (e.key === 'Escape' || e.key === 'Esc')) {
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', loadStoredVideos);
