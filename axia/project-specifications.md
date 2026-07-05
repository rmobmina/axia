# Project Specification: AI Exercise Form Coach

**Type:** Personal / Portfolio Project
**Platform:** Web Application (Browser-based)
**Status:** Frontend complete (React). Backend, ML pipeline, and scoring engine in development.

---

## 1. Project Overview

An interactive web application that helps users improve exercise form in real time. The app displays an anatomical, muscle-based avatar overlaid with a skeletal ("stickman") pose model. As the user performs an exercise on camera, their live pose is compared against a "perfect form" reference pose (animated in Blender), scored for accuracy, and used to generate corrective feedback. A muscle heatmap overlay also shows which muscle groups are engaged during the movement.

## 2. Goals & Objectives

- Provide real-time, camera-based feedback on exercise form without wearable sensors.
- Visually communicate correct form using an anatomical model rather than just numeric scores.
- Show muscle engagement per exercise via heatmap overlay, for educational value.
- Build a scoring system accurate enough to give meaningful, specific corrective suggestions (not just "good/bad").
- Ship as a self-contained web app suitable for a portfolio demo.

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Frontend (React)                 │
│  - Camera capture                                       │
│  - Anatomical avatar + muscle heatmap renderer          │
│  - Live stickman overlay renderer                       │
│  - Feedback/suggestions UI                              │
└───────────────────────┬─────────────────────────────────┘
                         │ (video frames / landmark data)
┌───────────────────────▼─────────────────────────────────┐
│                     Backend (Python)                    │
│  - MediaPipe pose estimation on incoming frames         │
│  - Pose normalization & calibration (user height/scale) │
│  - Reference pose library (from Blender animations)     │
│  - Scoring / comparison algorithm                       │
│  - Feedback generation logic                            │
└─────────────────────────────────────────────────────────┘
```

## 4. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript |
| Pose Estimation | MediaPipe (Python) |
| Reference Animation Authoring | Blender |
| Backend/API | Python (framework TBD — e.g. FastAPI/Flask) |
| Training/Reference Data | COCO, MPII datasets (for supplementary pose data, if used) |
| Scoring Engine | Custom (Python) |

## 5. Core Features

### 5.1 User Calibration
- On first use, the app calibrates the anatomical model and stickman scale to the user's height/proportions, likely using an initial reference pose (e.g., standing straight, arms out) captured via camera.

### 5.2 Live Camera Pose Overlay
- MediaPipe extracts pose landmarks from the live camera feed in real time.
- Landmarks are rendered as a stick-figure overlay on top of (or beside) the anatomical model.

### 5.3 Reference Exercise Animations
- "Perfect form" exercises (squats, lunges, etc.) are modeled/animated in Blender.
- Each reference animation is exported as a sequence of joint positions/angles per frame, matching the landmark schema used for the live pose (see Open Questions, Section 8).

### 5.4 Pose Comparison & Scoring
- Live pose landmarks are compared frame-by-frame (or at key phases of the movement) against the reference animation.
- A scoring algorithm outputs an accuracy score and identifies which joints/angles deviate most from correct form.
- *(This is flagged as the hardest custom component — see Section 8.)*

### 5.5 Feedback & Suggestions
- Based on scoring output, the app generates specific, human-readable suggestions (e.g., "lower your hips further," "keep your back straighter").

### 5.6 Anatomical Muscle Model with Heatmap
- The base avatar shows musculature.
- During/after an exercise, a heatmap overlay highlights which muscle groups are engaged, based on the exercise being performed.

## 6. Data & Datasets

- **MediaPipe Pose** — primary real-time landmark extraction (33-point model).
- **COCO / MPII** — potential supplementary datasets for pose reference or model training.
- **Blender-authored reference poses** — custom "ground truth" perfect-form data per exercise.

## 7. Non-Functional Requirements

- Real-time performance: pose overlay and feedback should feel responsive (target latency TBD).
- Runs in-browser using a standard webcam — no special hardware required.
- Should degrade gracefully in poor lighting / partial occlusion (MediaPipe limitation to plan around).

## 8. Open Questions / Technical Risks

- **Landmark schema mismatch:** COCO (17 keypoints), MPII (16 keypoints), and MediaPipe Pose (33 keypoints) all use different joint definitions. A single unified schema should be chosen early — likely MediaPipe's, since it's the live-capture source — and any COCO/MPII data mapped onto it, rather than trying to reconcile three schemas throughout the pipeline.
- **Scoring algorithm design:** needs to define whether comparison is angle-based (joint angles) vs. position-based (normalized coordinate distance), and how it's time-aligned (e.g., dynamic time warping) since the user won't move at the same tempo as the reference animation.
- **Muscle engagement mapping:** needs a defined mapping of exercise → muscle groups → heatmap regions (likely a static lookup table per exercise rather than computed).
- **Backend framework:** not yet chosen (Flask vs FastAPI vs other).
- **Reference data pipeline:** process for exporting Blender animation data into a usable landmark-sequence format needs to be defined.

## 9. Milestones (Draft)

| Phase | Deliverable |
|---|---|
| 1 | Backend skeleton + MediaPipe integration (live landmark extraction working) |
| 2 | Calibration logic (scale model to user height) |
| 3 | First Blender reference animation (e.g., squat) exported and integrated |
| 4 | Scoring algorithm v1 (basic comparison, single exercise) |
| 5 | Feedback generation from scoring output |
| 6 | Muscle heatmap overlay (static mapping) |
| 7 | Additional exercises added |
| 8 | Polish, testing, deployment |

## 10. Future Enhancements (Out of Scope for v1)

- Rep counting and set tracking.
- Progress tracking over time / user accounts.
- Additional exercise library expansion.
- Mobile app version.

---
*This is a living document — sections 8 and 9 in particular should be revisited as design decisions are finalized.*
