/**
 * Axia domain model.
 *
 * These types are the contract between the frontend and the future backend.
 * TODO(backend): mirror these as Pydantic models in FastAPI and generate a
 * typed client (e.g. openapi-typescript) so the mock service layer in
 * `src/services/api.ts` can be swapped for real HTTP calls without touching
 * any component.
 */

export type Role = 'patient' | 'clinician'

export type BodyRegion =
  | 'knee'
  | 'hip'
  | 'shoulder'
  | 'ankle'
  | 'core'
  | 'balance'
  | 'gait'

/** Named pose animations understood by <SkeletonGuide />. */
export type PoseId =
  | 'idle'
  | 'squat'
  | 'sit-to-stand'
  | 'shoulder-abduction'
  | 'knee-extension'
  | 'balance'
  | 'heel-raise'
  | 'bridge'
  | 'gait'

export interface Exercise {
  id: string
  name: string
  region: BodyRegion
  poseId: PoseId
  summary: string
  /** Plain-language, step-by-step patient instructions. */
  instructions: string[]
  safetyNote: string
  /** Coaching cues surfaced as mock "live feedback" during a session. */
  coachingCues: string[]
  defaultReps: number
  defaultSets: number
  holdSeconds?: number
  tempo?: string
  difficulty: 1 | 2 | 3
  equipment?: string
}

export type PlanItemStatus = 'not-started' | 'in-progress' | 'completed'

export interface PlanItem {
  exerciseId: string
  reps: number
  sets: number
  holdSeconds?: number
  /** e.g. "Daily", "3x / week" */
  frequency: string
  status: PlanItemStatus
  dueToday: boolean
}

export interface ExercisePlan {
  id: string
  patientId: string
  name: string
  focus: string
  stage: string
  startDate: string
  weeks: number
  items: PlanItem[]
  clinicianNote: string
}

export type RiskLevel = 'low' | 'moderate' | 'high'

export interface Patient {
  id: string
  name: string
  age: number
  condition: string
  program: string
  surgeryDate?: string
  riskLevel: RiskLevel
  /** % of assigned sessions completed in the last 7 days. */
  adherence7d: number
  /** Composite 0–100 mobility score (mocked; later derived from CV metrics). */
  mobilityScore: number
  /** Change vs. 30 days ago. */
  mobilityDelta: number
  lastActiveDate: string
  planId: string
  /** Small trend used for sparklines in clinician views. */
  mobilityTrend: number[]
  nextCheckIn?: string
}

export interface Clinician {
  id: string
  name: string
  credentials: string
  clinic: string
  email: string
}

export interface RehabSession {
  id: string
  patientId: string
  exerciseId: string
  date: string
  repsCompleted: number
  targetReps: number
  setsCompleted: number
  avgRomDeg: number
  targetRomDeg: number
  bestRomDeg: number
  symmetryPct: number
  /** 0–100 movement-quality score (mock; later from pose analysis). */
  formScore: number
  formNotes: string[]
  durationMin: number
  reviewed: boolean
  flagged: boolean
  flagReason?: string
}

export type AssessmentType = 'gait' | 'sit-to-stand' | 'balance' | 'shoulder-rom'

export interface AssessmentDef {
  id: AssessmentType
  name: string
  poseId: PoseId
  purpose: string
  durationLabel: string
  measures: string[]
  steps: string[]
  /** Length of the mock recording phase, seconds. */
  captureSeconds: number
}

export interface AssessmentMetric {
  key: string
  label: string
  value: number
  unit: string
  /** Change vs. previous result (same unit). */
  delta?: number
  /** Which direction counts as improvement. */
  betterWhen: 'higher' | 'lower'
}

export interface AssessmentResult {
  id: string
  patientId: string
  type: AssessmentType
  date: string
  metrics: AssessmentMetric[]
  improved: string[]
  keepWorkingOn: string[]
  /** Composite 0–100 for trend charts. */
  score: number
}

export interface WeeklyProgressPoint {
  /** ISO date of the week's Monday. */
  weekOf: string
  adherencePct: number
  mobilityScore: number
  romDeg: number
  painLevel: number
  sessionsCompleted: number
  sessionsAssigned: number
}

export type AlertSeverity = 'info' | 'warning' | 'serious'

export interface Alert {
  id: string
  patientId: string
  severity: AlertSeverity
  title: string
  detail: string
  date: string
}

export interface NoteMessage {
  id: string
  patientId: string
  from: 'clinician' | 'patient' | 'system'
  authorName: string
  date: string
  text: string
}

export interface Milestone {
  id: string
  label: string
  detail: string
  achievedOn: string
  icon: 'streak' | 'rom' | 'sessions' | 'assessment'
}
