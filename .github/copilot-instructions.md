# Movement Detection Demo - Copilot Instructions


## (1) Standards
Standards are about coding style, tech stack, and best practices.

### (1.1) Tech Stack
Default frameworks, libraries, and tools.

* HTML5: Provides the basic structure of the web application, including video elements and buttons
* JavaScript (ES6): Handles the application's logic, including user interactions, video recording, and interfacing with TensorFlow.js.
* MediaDevices API (getUserMedia): Accesses the user's webcam to capture the video stream.
* MediaRecorder API: Records the video stream and stores it as a Blob.
* TensorFlow.js: An open-source library for machine learning in JavaScript. We'll use a pre-trained model for object detection to identify movement.
* COCO-SSD Model: A pre-trained object detection model in the TensorFlow.js model zoo, capable of identifying 90 different types of objects, which we'll use to detect the presence and position of people to infer movement.
* IndexedDB: A low-level API for client-side storage of significant amounts of structured data, including files and blobs. This will be used to save the video recording in the browser.

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
