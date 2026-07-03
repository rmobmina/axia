import type { Clinician, Patient } from '@/types'

/**
 * Demo caseload. Maya Torres (p-maya) is the signed-in patient for the
 * patient portal; the clinician dashboard shows the full list.
 * TODO(backend): GET /patients, GET /patients/:id (PostgreSQL).
 */
/** Fixed "today" so the mock timeline always reads coherently in demos. */
export const DEMO_TODAY = '2026-07-03'

export const CLINICIAN: Clinician = {
  id: 'c-raman',
  name: 'Dr. Priya Raman',
  credentials: 'PT, DPT',
  clinic: 'Northside Physiotherapy & Mobility Clinic',
  email: 'p.raman@northsidephysio.example',
}

export const PATIENTS: Patient[] = [
  {
    id: 'p-maya',
    name: 'Maya Torres',
    age: 34,
    condition: 'ACL reconstruction · right knee',
    program: 'ACL Recovery — Phase 2',
    surgeryDate: '2026-05-21',
    riskLevel: 'moderate',
    adherence7d: 86,
    mobilityScore: 72,
    mobilityDelta: 6,
    lastActiveDate: '2026-07-02',
    planId: 'plan-maya',
    mobilityTrend: [58, 61, 63, 66, 69, 70, 72],
    nextCheckIn: '2026-07-05',
  },
  {
    id: 'p-arthur',
    name: 'Arthur Nguyen',
    age: 71,
    condition: 'Total hip replacement · left',
    program: 'Post-Op Hip — Phase 1',
    surgeryDate: '2026-06-09',
    riskLevel: 'high',
    adherence7d: 54,
    mobilityScore: 41,
    mobilityDelta: -4,
    lastActiveDate: '2026-06-29',
    planId: 'plan-arthur',
    mobilityTrend: [48, 47, 46, 45, 44, 42, 41],
    nextCheckIn: '2026-07-03',
  },
  {
    id: 'p-dee',
    name: 'Deirdre Walsh',
    age: 68,
    condition: 'Fall-risk / functional mobility',
    program: 'Balance & Falls Prevention',
    riskLevel: 'moderate',
    adherence7d: 63,
    mobilityScore: 55,
    mobilityDelta: 2,
    lastActiveDate: '2026-06-30',
    planId: 'plan-dee',
    mobilityTrend: [51, 52, 52, 54, 53, 54, 55],
    nextCheckIn: '2026-07-08',
  },
  {
    id: 'p-sam',
    name: 'Samuel Okafor',
    age: 45,
    condition: 'Rotator cuff repair · right shoulder',
    program: 'Shoulder Rehab — Phase 3',
    surgeryDate: '2026-04-02',
    riskLevel: 'low',
    adherence7d: 92,
    mobilityScore: 81,
    mobilityDelta: 9,
    lastActiveDate: '2026-07-02',
    planId: 'plan-sam',
    mobilityTrend: [64, 68, 71, 74, 77, 79, 81],
    nextCheckIn: '2026-07-12',
  },
  {
    id: 'p-lena',
    name: 'Lena Petrov',
    age: 58,
    condition: 'Knee osteoarthritis · bilateral',
    program: 'OA Strength & Mobility',
    riskLevel: 'low',
    adherence7d: 78,
    mobilityScore: 66,
    mobilityDelta: 3,
    lastActiveDate: '2026-07-01',
    planId: 'plan-lena',
    mobilityTrend: [60, 61, 63, 63, 64, 65, 66],
    nextCheckIn: '2026-07-15',
  },
  {
    id: 'p-jonah',
    name: 'Jonah Kim',
    age: 29,
    condition: 'Ankle sprain · return to sport',
    program: 'Ankle Stability — Late Stage',
    riskLevel: 'low',
    adherence7d: 95,
    mobilityScore: 88,
    mobilityDelta: 5,
    lastActiveDate: '2026-07-03',
    planId: 'plan-jonah',
    mobilityTrend: [78, 80, 82, 84, 85, 87, 88],
    nextCheckIn: '2026-07-20',
  },
]

export const patientById = (id: string): Patient => {
  const found = PATIENTS.find((p) => p.id === id)
  if (!found) throw new Error(`Unknown patient: ${id}`)
  return found
}
