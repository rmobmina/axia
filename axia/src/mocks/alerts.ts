import type { Alert, NoteMessage } from '@/types'

/**
 * Concern flags surfaced to the clinician dashboard.
 * TODO(cv-pipeline): generated automatically from metric thresholds and
 * trend detection once real analysis lands.
 */
export const ALERTS: Alert[] = [
  {
    id: 'al-1',
    patientId: 'p-arthur',
    severity: 'serious',
    title: 'Gait speed declining',
    detail: 'Walking speed down 10% over two weeks (0.61 → 0.55 m/s). Consider an earlier follow-up.',
    date: '2026-06-30',
  },
  {
    id: 'al-2',
    patientId: 'p-arthur',
    severity: 'warning',
    title: '4 missed sessions this week',
    detail: 'Adherence dropped to 54%. Patient reported fatigue in the last session note.',
    date: '2026-07-01',
  },
  {
    id: 'al-3',
    patientId: 'p-dee',
    severity: 'warning',
    title: 'Balance holds below target',
    detail: 'Single-leg holds averaging 12s against a 15s target, weaker on the left.',
    date: '2026-06-30',
  },
  {
    id: 'al-4',
    patientId: 'p-maya',
    severity: 'info',
    title: 'Asymmetry resolving',
    detail: 'Left-right loading improved from 71% to 84% — earlier flag can likely be cleared.',
    date: '2026-07-03',
  },
]

export const alertsForPatient = (patientId: string) =>
  ALERTS.filter((a) => a.patientId === patientId)

/**
 * Clinician ↔ patient notes.
 * TODO(backend): POST /notes for persistence; currently added notes live in
 * component state only.
 */
export const NOTES: NoteMessage[] = [
  {
    id: 'n-1',
    patientId: 'p-maya',
    from: 'clinician',
    authorName: 'Dr. Priya Raman',
    date: '2026-07-02',
    text: 'Great progress on knee extension this week, Maya. Let’s push the squat depth slightly — I’ve updated your plan. See you Saturday for your check-in.',
  },
  {
    id: 'n-2',
    patientId: 'p-maya',
    from: 'patient',
    authorName: 'Maya Torres',
    date: '2026-06-30',
    text: 'Knee felt much steadier on stairs today. Slight stiffness in the mornings but it eases after the heel slides.',
  },
  {
    id: 'n-3',
    patientId: 'p-maya',
    from: 'clinician',
    authorName: 'Dr. Priya Raman',
    date: '2026-06-25',
    text: 'Morning stiffness at this stage is normal. Keep icing after evening sessions.',
  },
  {
    id: 'n-4',
    patientId: 'p-maya',
    from: 'system',
    authorName: 'Axia',
    date: '2026-06-24',
    text: 'Plan updated: Mini Squats progressed from 8 to 10 reps per set.',
  },
  {
    id: 'n-5',
    patientId: 'p-arthur',
    from: 'clinician',
    authorName: 'Dr. Priya Raman',
    date: '2026-06-29',
    text: 'Arthur, shorter sessions are fine this week — two good sit-to-stand sets beat one exhausting session. Call the clinic if the hip pain passes 6/10.',
  },
  {
    id: 'n-6',
    patientId: 'p-arthur',
    from: 'patient',
    authorName: 'Arthur Nguyen',
    date: '2026-06-29',
    text: 'Feeling worn out this week. The marching makes my hip ache by the second set.',
  },
]

export const notesForPatient = (patientId: string) =>
  NOTES.filter((n) => n.patientId === patientId).sort((a, b) =>
    b.date.localeCompare(a.date),
  )
