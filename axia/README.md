# Axia — Rehab & Mobility Platform (Frontend Prototype)

A computer-vision rehabilitation and mobility platform for patients and clinicians.
This phase is a **frontend-first prototype**: every screen is fully navigable with
believable mock data, and the architecture leaves clean seams for the future
FastAPI + OpenCV + MediaPipe/MoveNet backend.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

The landing page is a mock sign-in: pick **Patient** (Maya Torres, ACL recovery,
week 6) or **Clinician** (Dr. Priya Raman, 6-patient caseload). A "View as" pill in
the header switches roles anywhere.

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · shadcn-style component kit ·
Recharts · Framer Motion · React Router

## Structure

```
src/
├── components/
│   ├── ui/            # shadcn-style primitives (Button, Card, Badge, Tabs, …)
│   ├── charts/        # Recharts wrappers (TrendChart, AdherenceBars, Sparkline, SymmetryBar)
│   ├── skeleton/      # SkeletonGuide — animated pose demo system + pose keyframes
│   └── …              # StatCard, StatusBadge, CameraPlaceholder, EmptyState, Logo, RoleSwitcher
├── layouts/           # PatientLayout (paper bg, bottom tabs on mobile), ClinicianLayout (navy sidebar)
├── pages/
│   ├── patient/       # Dashboard, Plan, ExerciseSession, SessionSummary,
│   │                  # AssessmentsHub, AssessmentRun, AssessmentResults, Progress, Profile
│   └── clinician/     # Dashboard, PatientsList, PatientDetail, AssignPlan,
│                      # Reviews, SessionReview, Settings
├── mocks/             # patients, exercises, plans, sessions, assessments, progress, alerts/notes
├── services/api.ts    # mock async service layer — the single backend seam
├── hooks/useApi.ts    # loading/error states for the mock fetches
├── context/           # RoleContext (mock auth / role switching)
├── types/             # shared domain model (future Pydantic mirror)
└── lib/               # cn(), date/format helpers
```

## Design system

Brand palette drives everything (see `src/index.css` `@theme`):

| Token | Hex | Use |
|---|---|---|
| `navy-950` | `#0B2545` | app shell, sidebar, camera surfaces |
| `navy-800` | `#13315C` | dark hero cards, hovers |
| `navy-700` | `#134074` | primary CTAs, selected states, links |
| `mist-400` | `#8DA9C4` | secondary accents, chips (plus derived 50–300 tints) |
| `paper` | `#EEF4ED` | calm patient-facing page background |

Chart series colors (`chart-1/2/3`) are derived from the brand hues but tuned for
data-vis legibility (lightness band, chroma floor, CVD separation — validated).
Status colors (good/warn/alert) are reserved for state and always ship with an
icon + text label, never color alone.

Accessibility: large touch targets (44px+ controls), skip links, visible focus
rings, `aria-live` coaching updates, `prefers-reduced-motion` respected globally
(including the SkeletonGuide loop), plain-language patient copy.

## The SkeletonGuide

`src/components/skeleton/SkeletonGuide.tsx` renders the animated "dummy" that
demonstrates each movement — a stylized SVG line figure that tween-loops through
2D joint keyframes (`poses.ts`), with highlighted joints and dashed target-range
arcs. It is deliberately **frame-based**: when real reference pose sequences
exist (MediaPipe/MoveNet keypoint JSON), they map onto the same joint model and
play back through the same component. A second instance can later render the
patient's own tracked skeleton for side-by-side comparison.

## Where the backend plugs in (search for `TODO(backend)` / `TODO(cv-pipeline)`)

- `services/api.ts` — every mock function maps 1:1 to a planned FastAPI endpoint
- `components/CameraPlaceholder.tsx` — getUserMedia preview → MediaRecorder upload → async CV job queue
- `pages/patient/ExerciseSessionPage.tsx` — rep counting + live form feedback from pose tracking
- `pages/patient/AssessmentRunPage.tsx` — video upload + analysis-job polling instead of mock timers
- `components/skeleton/poses.ts` — hand-authored keyframes → exported reference motion JSON
- `pages/clinician/SessionReviewPage.tsx` — video playback + frame-accurate key moments
- Notes/plan persistence (`saveNote`, `assignPlan`) — currently console-logged mocks

All data is simulated; no real patient information.
