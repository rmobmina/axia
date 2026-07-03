import type { Milestone, WeeklyProgressPoint } from '@/types'

/**
 * Weekly progress rollups for the patient Progress page and clinician trends.
 * TODO(backend): computed nightly from sessions + assessment results.
 */
export const WEEKLY_PROGRESS: Record<string, WeeklyProgressPoint[]> = {
  'p-maya': [
    { weekOf: '2026-05-25', adherencePct: 60, mobilityScore: 54, romDeg: 42, painLevel: 5, sessionsCompleted: 9, sessionsAssigned: 15 },
    { weekOf: '2026-06-01', adherencePct: 73, mobilityScore: 58, romDeg: 47, painLevel: 4, sessionsCompleted: 11, sessionsAssigned: 15 },
    { weekOf: '2026-06-08', adherencePct: 80, mobilityScore: 61, romDeg: 51, painLevel: 4, sessionsCompleted: 12, sessionsAssigned: 15 },
    { weekOf: '2026-06-15', adherencePct: 73, mobilityScore: 63, romDeg: 55, painLevel: 3, sessionsCompleted: 11, sessionsAssigned: 15 },
    { weekOf: '2026-06-22', adherencePct: 87, mobilityScore: 68, romDeg: 60, painLevel: 3, sessionsCompleted: 13, sessionsAssigned: 15 },
    { weekOf: '2026-06-29', adherencePct: 86, mobilityScore: 72, romDeg: 64, painLevel: 2, sessionsCompleted: 12, sessionsAssigned: 14 },
  ],
  'p-arthur': [
    { weekOf: '2026-06-15', adherencePct: 71, mobilityScore: 46, romDeg: 68, painLevel: 6, sessionsCompleted: 10, sessionsAssigned: 14 },
    { weekOf: '2026-06-22', adherencePct: 64, mobilityScore: 44, romDeg: 70, painLevel: 6, sessionsCompleted: 9, sessionsAssigned: 14 },
    { weekOf: '2026-06-29', adherencePct: 54, mobilityScore: 41, romDeg: 71, painLevel: 7, sessionsCompleted: 7, sessionsAssigned: 13 },
  ],
}

export const MILESTONES: Record<string, Milestone[]> = {
  'p-maya': [
    {
      id: 'm-1',
      label: '7-day streak',
      detail: 'Completed every assigned session for a full week.',
      achievedOn: '2026-06-28',
      icon: 'streak',
    },
    {
      id: 'm-2',
      label: 'Range milestone',
      detail: 'Knee extension passed 70° for the first time.',
      achievedOn: '2026-07-01',
      icon: 'rom',
    },
    {
      id: 'm-3',
      label: '25 sessions',
      detail: 'Twenty-five guided sessions completed since surgery.',
      achievedOn: '2026-06-24',
      icon: 'sessions',
    },
    {
      id: 'm-4',
      label: 'Assessment gain',
      detail: 'Sit-to-stand time improved 23% since baseline.',
      achievedOn: '2026-07-03',
      icon: 'assessment',
    },
  ],
}

/** Current streak (consecutive active days) per patient. */
export const STREAKS: Record<string, number> = {
  'p-maya': 5,
  'p-arthur': 0,
  'p-dee': 2,
  'p-sam': 11,
  'p-lena': 4,
  'p-jonah': 16,
}
