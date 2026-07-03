/**
 * Mock service layer.
 *
 * Every screen fetches through these functions rather than importing mock
 * modules directly, so swapping in a real backend is a one-file change.
 *
 * TODO(backend): replace each function body with a fetch to FastAPI, e.g.
 *   getPatient(id)        → GET  /api/patients/{id}
 *   getPlan(patientId)    → GET  /api/patients/{id}/plan
 *   getSessions(...)      → GET  /api/sessions?patient_id=…
 *   submitSession(...)    → POST /api/sessions  (multipart video upload →
 *                           async CV job queue → poll /api/jobs/{id})
 *   saveNote(...)         → POST /api/notes
 * Keep the return types identical — components only know the types in
 * `src/types`.
 */
import type {
  Alert,
  AssessmentDef,
  AssessmentResult,
  AssessmentType,
  Exercise,
  ExercisePlan,
  Milestone,
  NoteMessage,
  Patient,
  RehabSession,
  WeeklyProgressPoint,
} from '@/types'
import { EXERCISES, exerciseById } from '@/mocks/exercises'
import { PATIENTS, patientById } from '@/mocks/patients'
import { planByPatientId } from '@/mocks/plans'
import { SESSIONS, sessionById, sessionsForPatient } from '@/mocks/sessions'
import {
  ASSESSMENTS,
  ASSESSMENT_DUE,
  assessmentById,
  resultById,
  resultsForPatient,
} from '@/mocks/assessments'
import { ALERTS, alertsForPatient, notesForPatient } from '@/mocks/alerts'
import { MILESTONES, STREAKS, WEEKLY_PROGRESS } from '@/mocks/progress'

/** Simulated network latency so loading states are visible in the demo. */
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))

export const api = {
  async listPatients(): Promise<Patient[]> {
    await delay()
    return PATIENTS
  },

  async getPatient(id: string): Promise<Patient> {
    await delay(250)
    return patientById(id)
  },

  async listExercises(): Promise<Exercise[]> {
    await delay(250)
    return EXERCISES
  },

  async getExercise(id: string): Promise<Exercise> {
    await delay(200)
    return exerciseById(id)
  },

  async getPlan(patientId: string): Promise<ExercisePlan> {
    await delay(300)
    return planByPatientId(patientId)
  },

  async listSessions(patientId?: string): Promise<RehabSession[]> {
    await delay(300)
    return patientId
      ? sessionsForPatient(patientId)
      : [...SESSIONS].sort((a, b) => b.date.localeCompare(a.date))
  },

  async getSession(id: string): Promise<RehabSession> {
    await delay(250)
    return sessionById(id)
  },

  async listAssessments(): Promise<AssessmentDef[]> {
    await delay(200)
    return ASSESSMENTS
  },

  async getAssessment(id: AssessmentType): Promise<AssessmentDef> {
    await delay(200)
    return assessmentById(id)
  },

  async getAssessmentDue(patientId: string) {
    await delay(150)
    return ASSESSMENT_DUE[patientId] ?? null
  },

  async listAssessmentResults(patientId: string): Promise<AssessmentResult[]> {
    await delay(300)
    return resultsForPatient(patientId)
  },

  async getAssessmentResult(id: string): Promise<AssessmentResult> {
    await delay(250)
    return resultById(id)
  },

  async listAlerts(): Promise<Alert[]> {
    await delay(250)
    return ALERTS
  },

  async listAlertsForPatient(patientId: string): Promise<Alert[]> {
    await delay(200)
    return alertsForPatient(patientId)
  },

  async listNotes(patientId: string): Promise<NoteMessage[]> {
    await delay(250)
    return notesForPatient(patientId)
  },

  async getWeeklyProgress(patientId: string): Promise<WeeklyProgressPoint[]> {
    await delay(300)
    return WEEKLY_PROGRESS[patientId] ?? []
  },

  async getMilestones(patientId: string): Promise<Milestone[]> {
    await delay(200)
    return MILESTONES[patientId] ?? []
  },

  async getStreak(patientId: string): Promise<number> {
    await delay(100)
    return STREAKS[patientId] ?? 0
  },

  /** TODO(backend): POST /api/plans — persists a clinician-assigned plan. */
  async assignPlan(plan: ExercisePlan): Promise<{ ok: true }> {
    await delay(700)
    console.info('[mock] plan assigned', plan)
    return { ok: true }
  },

  /** TODO(backend): POST /api/notes — persists a clinician note. */
  async saveNote(patientId: string, text: string): Promise<{ ok: true }> {
    await delay(500)
    console.info('[mock] note saved', { patientId, text })
    return { ok: true }
  },

  /** TODO(backend): PATCH /api/sessions/:id { reviewed: true } */
  async markSessionReviewed(sessionId: string): Promise<{ ok: true }> {
    await delay(400)
    console.info('[mock] session reviewed', sessionId)
    return { ok: true }
  },
}
