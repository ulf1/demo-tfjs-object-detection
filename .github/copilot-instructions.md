# Movement Detection Demo - Copilot Instructions


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


### (1.2) Code Style
Formatting rules, naming conventions, and preferences.


### (1.3) Best Practices 
Development philosophy (e.g., TDD, commit patterns, etc.).



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
	- Bounding box coordinates (optional but recommended)
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


