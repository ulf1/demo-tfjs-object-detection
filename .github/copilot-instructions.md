# Object Detection Demo - Copilot Instructions


## (1) Standards
Standards are about coding style, tech stack, and best practices.

### (1.1) Tech Stack
Default frameworks, libraries, and tools.

* HTML5: Provides the basic structure of the web application, including video elements and buttons
* JavaScript (ES6): Handles the application's logic, including user interactions, video recording, and interfacing with TensorFlow.js.
* MediaDevices API (getUserMedia): Accesses the user's webcam to capture the video stream. URL: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
* MediaRecorder API: Records the video stream and stores it as a Blob. URL: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
* TensorFlow.js: An open-source library for machine learning in JavaScript. We'll use a pre-trained model for object detection to identify movement. URL: https://github.com/tensorflow/tfjs
* COCO-SSD Model: A pre-trained object detection model in the TensorFlow.js model zoo, capable of identifying 90 different types of objects, which we'll use to detect the presence and position of people to infer movement. URL: https://github.com/tensorflow/tfjs-models/blob/master/coco-ssd/README.md
* IndexedDB: A low-level API for client-side storage of significant amounts of structured data, including files and blobs. This will be used to save the video recording in the browser. URL: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
* Bulma: A lightweight, mobile-first CSS framework that ensures the webapp is visually appealing and usable across devices. Responsive video/canvas sizing and UI controls improve user experience for all screen sizes.


### (1.2) Code Style
Formatting rules, naming conventions, and preferences.

#### (1.2.1) HTML Requirements
- **HTML**:
- Use HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<search>`, etc.)
- Include appropriate ARIA attributes for accessibility
- Ensure valid markup that passes W3C validation
- Use responsive design practices
- Optimize images using modern formats (`WebP`, `AVIF`)
- Include `loading="lazy"` on images where applicable
- Generate `srcset` and `sizes` attributes for responsive images when relevant
- Prioritize SEO-friendly elements (`<title>`, `<meta description>`, Open Graph tags)
		
            
#### (1.2.2) JavaScript Requirements  
- **Minimum Compatibility**: ECMAScript 2020 (ES11) or higher
- **Features to Use**:
- Arrow functions
- Template literals
- Destructuring assignment
- Spread/rest operators
- Async/await for asynchronous code
- Classes with proper inheritance when OOP is needed
- Object shorthand notation
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- Dynamic imports
- BigInt for large integers
- `Promise.allSettled()`
- `String.prototype.matchAll()`
- `globalThis` object
- Private class fields and methods
- Export * as namespace syntax
- Array methods (`map`, `filter`, `reduce`, `flatMap`, etc.)
- **Avoid**:
- `var` keyword (use `const` and `let`)
- jQuery or any external libraries
- Callback-based asynchronous patterns when promises can be used
- Internet Explorer compatibility
- Legacy module formats (use ES modules)
- Limit use of `eval()` due to security risks
- **Performance Considerations:**
- Recommend code splitting and dynamic imports for lazy loading
**Error Handling**:
- Use `try-catch` blocks **consistently** for asynchronous and API calls, and handle promise rejections explicitly.
- Differentiate among:
- **Network errors** (e.g., timeouts, server errors, rate-limiting)
- **Functional/business logic errors** (logical missteps, invalid user input, validation failures)
- **Runtime exceptions** (unexpected errors such as null references)
- Provide **user-friendly** error messages (e.g., “Something went wrong. Please try again shortly.”) and log more technical details to dev/ops (e.g., via a logging service).
- Consider a central error handler function or global event (e.g., `window.addEventListener('unhandledrejection')`) to consolidate reporting.
- Carefully handle and validate JSON responses, incorrect HTTP status codes, etc.
   

### (1.3) Best Practices 
Development philosophy (e.g., TDD, commit patterns, etc.).

#### (1.3.1) MAKING EDITS
- Focus on one conceptual change at a time
- Show clear "before" and "after" snippets when proposing changes
- Include concise explanations of what changed and why
- Always check if the edit maintains the project's coding style

#### (1.3.2) Edit sequence:
1. [First specific change] - Purpose: [why]
2. [Second specific change] - Purpose: [why]
3. Do you approve this plan? I'll proceed with Edit [number] after your confirmation.
4. WAIT for explicit user confirmation before making ANY edits when user ok edit [number]
            
#### (1.3.3) EXECUTION PHASE
- After each individual edit, clearly indicate progress:
	"✅ Completed edit [#] of [total]. Ready for next edit?"
- If you discover additional needed changes during editing:
- STOP and update the plan
- Get approval before continuing

#### (1.3.4) REFACTORING GUIDANCE
When refactoring large files:
- Break work into logical, independently functional chunks
- Ensure each intermediate state maintains functionality
- Consider temporary duplication as a valid interim step
- Always indicate the refactoring pattern being applied

#### (1.3.5) RATE LIMIT AVOIDANCE
- For very large files, suggest splitting changes across multiple sessions
- Prioritize changes that are logically complete units
- Always provide clear stopping points

## (2) Product
Product are the mission, architecture, roadmap, and decisions.

### (2.1) Mission
What you're building, for whom, and why it matters.


### (2.2) Roadmap
Features shipped, in progress, and planned.


### (2.3) Decisions 
Key architectural and technical choices (with rationale).


### (2.4) Product-specific stack
The exact versions and configurations for this codebase.



## (3) Specifications
Specifications are detailed plans & tasks for each feature implementation.
For example, 
- SRD (Spec Requirements Document) — Goals for the feature, user stories, success criteria;
- Technical Specs — API design, database changes, UI requirements;
- Tasks Breakdown — Trackable step-by-step implementation plan with dependencies.


### (3.1) Object Detection and Tracking Specification

- Identify all objects known to the COCO-SSD model in the recorded video.
- Track the movement of each identified object by drawing bounding boxes/rectangles around them in the video frames.
- Output a log of the object detection process, including:
	- Timestamp (start, end) for each detection event
	- Label/type of the detected object
	- (Optional) Position or bounding box coordinates for each detection
	- The log should be structured and accessible for review (e.g., as a downloadable file or console output).


#### SRD (Spec Requirements Document)
**Goal:**
- Enable detection and tracking of all objects recognized by the COCO-SSD model in recorded videos.
- Provide a clear, accessible log of detection events for review or export.

**User Stories:**
- As a user, I want to see bounding boxes around all detected objects in the video so I can visually track their movement.
- As a user, I want to access a log of detected objects with timestamps and labels so I can analyze the detection process.

**Success Criteria:**
- All objects recognized by COCO-SSD are detected and tracked with bounding boxes in the video.
- The detection log includes timestamps, object labels, and is accessible/downloadable.

#### Technical Specs
- Use TensorFlow.js with the COCO-SSD model for object detection.
- Process each video frame to detect objects and draw bounding boxes.
- Maintain a log structure (e.g., array of objects) with:
	- Object label/type
	- Detection start and end timestamps
	- Bounding box coordinates
- Provide a UI element to download or view the detection log (e.g., as JSON or CSV).
- Ensure performance is sufficient for near real-time detection on typical hardware.

#### Tasks Breakdown
1. Integrate TensorFlow.js and load the COCO-SSD model.
2. Capture video frames from the recorded video for processing.
3. Run object detection on each frame and draw bounding boxes for each detected object.
4. Track objects across frames (associate detections by label and position).
5. Record detection events in a structured log with timestamps and labels.
6. Implement a UI component to display and/or download the detection log.
7. Test detection accuracy, log completeness, and UI usability.


# (3.2) Save LiveCanvas Overlay in Video Recording

### Specification

- The video recording should include the liveCanvas overlay (bounding boxes, labels, etc.) as seen during live detection.
- Use `liveCanvas.captureStream()` to obtain a MediaStream of the canvas, which contains both the video frame and overlay.
- Use the captured canvas stream as the source for the MediaRecorder, so the output video matches the live view.
- Ensure the overlay is drawn to the canvas before each frame is captured for recording.
- The recorded video should display all overlays as they appeared during live detection.

#### Tasks Breakdown
1. Draw both the video frame and overlay to `liveCanvas` during live detection.
2. Use `liveCanvas.captureStream()` to get a MediaStream for recording.
3. Use this stream for the MediaRecorder instead of the raw webcam stream.
4. Test that the recorded video includes all overlays and matches the live view.


## (3.3) Show All Videos Stored in IndexedDB

### Specification

- Display a list of all recorded videos stored in IndexedDB.
- Use an HTML table to show:
	- Recording date & time (from the `timestamp` field)
	- Video size in KB
	- Download button for each video
	- Deletion button for each video

### Technical Specs

- Query the "videos" object store in IndexedDB to retrieve all stored videos.
- For each video entry, extract:
	- `timestamp` (format as local date & time string)
	- `video` (Blob, use `size` property for KB)
- Render a table in the UI with columns: Date & Time, Size (KB), Download, Delete.
- Download button: triggers download of the video as a `.webm` file.
- Delete button: removes the video entry from IndexedDB and updates the table.
- Table should update dynamically after deletion or new recording.

### Tasks Breakdown

1. Add a new section in the HTML for the video list table.
2. Implement a function to read all videos from IndexedDB.
3. Render the table with required columns and buttons.
4. Implement download functionality for each video.
5. Implement deletion functionality for each video.
6. Refresh the table after any change (add/delete).
7. Test with multiple recordings and deletions for correctness.

## (3.4) Detect device's cameras

### Specification

- Implement functionality to detect and list all available camera devices on the user's system.
- Use the MediaDevices API to enumerate video input devices.
- Display the list of detected cameras in the UI, allowing the user to select which camera to use for recording.

### Technical Specs

- Use `navigator.mediaDevices.enumerateDevices()` to get a list of all media devices.
- Filter the list to include only video input devices (i.e., cameras).
- For each detected camera, extract:
	- `deviceId` (unique identifier for the camera)
	- `label` (human-readable name of the camera)
- Render the camera list in the UI with options to select a camera.

### Tasks Breakdown

1. Implement a function to detect and list all available cameras.
2. Update the UI to display the list of cameras.
3. Allow the user to select a camera from the list.
4. Update the video stream source based on the selected camera.
5. Test with multiple cameras to ensure correct detection and selection.
