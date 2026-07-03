import type { AssessmentDef, AssessmentResult, AssessmentType } from '@/types'

/**
 * Mobility / functional assessment definitions and results.
 * TODO(cv-pipeline): metrics (cadence, symmetry, STS time, ROM, sway) will be
 * computed from recorded video by the pose-estimation pipeline. For now the
 * results below are believable mock values with realistic trends.
 * TODO(backend): GET /assessments, GET /assessment-results?patientId=…
 */
export const ASSESSMENTS: AssessmentDef[] = [
  {
    id: 'gait',
    name: 'Gait Walk Test',
    poseId: 'gait',
    purpose: 'Checks the rhythm, speed, and symmetry of your walking.',
    durationLabel: '~2 min',
    measures: ['Walking speed', 'Cadence', 'Step symmetry', 'Stride length'],
    captureSeconds: 20,
    steps: [
      'Place your phone so your whole body is visible from the side.',
      'Stand at one end of a clear 4-metre path.',
      'When the countdown ends, walk at your normal pace to the other end.',
      'Turn around and walk back. Repeat until the timer finishes.',
    ],
  },
  {
    id: 'sit-to-stand',
    name: '5x Sit-to-Stand',
    poseId: 'sit-to-stand',
    purpose: 'Measures leg strength and how easily you can stand from a chair.',
    durationLabel: '~1 min',
    measures: ['Total time', 'Rise speed', 'Left-right loading', 'Steadiness'],
    captureSeconds: 15,
    steps: [
      'Use a firm chair against a wall, phone facing you from the front.',
      'Sit with arms crossed over your chest.',
      'When the countdown ends, stand up and sit down 5 times, as quickly as feels safe.',
      'Stay standing after the fifth rise.',
    ],
  },
  {
    id: 'balance',
    name: 'One-Leg Balance',
    poseId: 'balance',
    purpose: 'Checks steadiness on each leg — an important fall-risk signal.',
    durationLabel: '~2 min',
    measures: ['Hold time per side', 'Body sway', 'Left-right difference'],
    captureSeconds: 30,
    steps: [
      'Stand near a counter you can touch if needed, phone facing you.',
      'Lift one foot a few inches off the floor.',
      'Hold as steady as you can until the timer ends.',
      'Repeat on the other leg.',
    ],
  },
  {
    id: 'shoulder-rom',
    name: 'Shoulder ROM Check',
    poseId: 'shoulder-abduction',
    purpose: 'Measures how far you can raise your arm out to the side.',
    durationLabel: '~1 min',
    measures: ['Peak abduction angle', 'Left-right difference', 'Smoothness'],
    captureSeconds: 12,
    steps: [
      'Stand facing the camera with both arms relaxed.',
      'Slowly raise both arms out to the sides as high as comfortable.',
      'Hold for two seconds at the top, then lower slowly.',
      'Repeat three times.',
    ],
  },
]

export const assessmentById = (id: string): AssessmentDef => {
  const found = ASSESSMENTS.find((a) => a.id === id)
  if (!found) throw new Error(`Unknown assessment: ${id}`)
  return found
}

/** Which assessment is due next per patient (mock schedule). */
export const ASSESSMENT_DUE: Record<string, { type: AssessmentType; due: string }> = {
  'p-maya': { type: 'sit-to-stand', due: '2026-07-03' },
  'p-arthur': { type: 'gait', due: '2026-07-03' },
  'p-dee': { type: 'balance', due: '2026-07-04' },
  'p-sam': { type: 'shoulder-rom', due: '2026-07-12' },
}

export const ASSESSMENT_RESULTS: AssessmentResult[] = [
  // ---- Maya: sit-to-stand improving across three sessions ----
  {
    id: 'ar-maya-sts-1',
    patientId: 'p-maya',
    type: 'sit-to-stand',
    date: '2026-06-05',
    score: 58,
    metrics: [
      { key: 'totalTime', label: 'Total time', value: 16.8, unit: 's', betterWhen: 'lower' },
      { key: 'riseSpeed', label: 'Avg rise speed', value: 1.9, unit: 's/rep', betterWhen: 'lower' },
      { key: 'loading', label: 'Left-right loading', value: 71, unit: '%', betterWhen: 'higher' },
      { key: 'steadiness', label: 'Steadiness', value: 68, unit: '/100', betterWhen: 'higher' },
    ],
    improved: [],
    keepWorkingOn: ['Even push-off through the right leg', 'Smoother descent'],
  },
  {
    id: 'ar-maya-sts-2',
    patientId: 'p-maya',
    type: 'sit-to-stand',
    date: '2026-06-19',
    score: 66,
    metrics: [
      { key: 'totalTime', label: 'Total time', value: 14.6, unit: 's', delta: -2.2, betterWhen: 'lower' },
      { key: 'riseSpeed', label: 'Avg rise speed', value: 1.6, unit: 's/rep', delta: -0.3, betterWhen: 'lower' },
      { key: 'loading', label: 'Left-right loading', value: 78, unit: '%', delta: 7, betterWhen: 'higher' },
      { key: 'steadiness', label: 'Steadiness', value: 74, unit: '/100', delta: 6, betterWhen: 'higher' },
    ],
    improved: ['2.2s faster overall', 'More even leg loading'],
    keepWorkingOn: ['Controlled sit-down on the final reps'],
  },
  {
    id: 'ar-maya-sts-3',
    patientId: 'p-maya',
    type: 'sit-to-stand',
    date: '2026-07-03',
    score: 73,
    metrics: [
      { key: 'totalTime', label: 'Total time', value: 12.9, unit: 's', delta: -1.7, betterWhen: 'lower' },
      { key: 'riseSpeed', label: 'Avg rise speed', value: 1.4, unit: 's/rep', delta: -0.2, betterWhen: 'lower' },
      { key: 'loading', label: 'Left-right loading', value: 84, unit: '%', delta: 6, betterWhen: 'higher' },
      { key: 'steadiness', label: 'Steadiness', value: 79, unit: '/100', delta: 5, betterWhen: 'higher' },
    ],
    improved: ['1.7s faster overall', 'Loading symmetry now in the target zone', 'Steadier throughout'],
    keepWorkingOn: ['Keep the last two reps as controlled as the first three'],
  },

  // ---- Maya: gait ----
  {
    id: 'ar-maya-gait-1',
    patientId: 'p-maya',
    type: 'gait',
    date: '2026-06-12',
    score: 62,
    metrics: [
      { key: 'speed', label: 'Walking speed', value: 0.98, unit: 'm/s', betterWhen: 'higher' },
      { key: 'cadence', label: 'Cadence', value: 102, unit: 'steps/min', betterWhen: 'higher' },
      { key: 'symmetry', label: 'Step symmetry', value: 81, unit: '%', betterWhen: 'higher' },
      { key: 'stride', label: 'Stride length', value: 1.12, unit: 'm', betterWhen: 'higher' },
    ],
    improved: [],
    keepWorkingOn: ['Slightly longer step on the right side'],
  },
  {
    id: 'ar-maya-gait-2',
    patientId: 'p-maya',
    type: 'gait',
    date: '2026-06-28',
    score: 70,
    metrics: [
      { key: 'speed', label: 'Walking speed', value: 1.11, unit: 'm/s', delta: 0.13, betterWhen: 'higher' },
      { key: 'cadence', label: 'Cadence', value: 108, unit: 'steps/min', delta: 6, betterWhen: 'higher' },
      { key: 'symmetry', label: 'Step symmetry', value: 87, unit: '%', delta: 6, betterWhen: 'higher' },
      { key: 'stride', label: 'Stride length', value: 1.21, unit: 'm', delta: 0.09, betterWhen: 'higher' },
    ],
    improved: ['Walking speed up 13%', 'Step symmetry improved'],
    keepWorkingOn: ['Maintain rhythm when turning'],
  },

  // ---- Maya: balance ----
  {
    id: 'ar-maya-bal-1',
    patientId: 'p-maya',
    type: 'balance',
    date: '2026-06-20',
    score: 64,
    metrics: [
      { key: 'holdRight', label: 'Right-leg hold', value: 22, unit: 's', betterWhen: 'higher' },
      { key: 'holdLeft', label: 'Left-leg hold', value: 29, unit: 's', betterWhen: 'higher' },
      { key: 'sway', label: 'Body sway', value: 3.4, unit: 'cm', betterWhen: 'lower' },
      { key: 'lrDiff', label: 'Side difference', value: 24, unit: '%', betterWhen: 'lower' },
    ],
    improved: [],
    keepWorkingOn: ['Right-leg stability (operated side)'],
  },

  // ---- Arthur: gait declining ----
  {
    id: 'ar-arthur-gait-1',
    patientId: 'p-arthur',
    type: 'gait',
    date: '2026-06-16',
    score: 46,
    metrics: [
      { key: 'speed', label: 'Walking speed', value: 0.61, unit: 'm/s', betterWhen: 'higher' },
      { key: 'cadence', label: 'Cadence', value: 84, unit: 'steps/min', betterWhen: 'higher' },
      { key: 'symmetry', label: 'Step symmetry', value: 69, unit: '%', betterWhen: 'higher' },
      { key: 'stride', label: 'Stride length', value: 0.78, unit: 'm', betterWhen: 'higher' },
    ],
    improved: [],
    keepWorkingOn: ['Weight acceptance on the left leg'],
  },
  {
    id: 'ar-arthur-gait-2',
    patientId: 'p-arthur',
    type: 'gait',
    date: '2026-06-30',
    score: 41,
    metrics: [
      { key: 'speed', label: 'Walking speed', value: 0.55, unit: 'm/s', delta: -0.06, betterWhen: 'higher' },
      { key: 'cadence', label: 'Cadence', value: 79, unit: 'steps/min', delta: -5, betterWhen: 'higher' },
      { key: 'symmetry', label: 'Step symmetry', value: 63, unit: '%', delta: -6, betterWhen: 'higher' },
      { key: 'stride', label: 'Stride length', value: 0.72, unit: 'm', delta: -0.06, betterWhen: 'higher' },
    ],
    improved: [],
    keepWorkingOn: ['Walking speed declining — flagged for clinician review', 'Left stance time'],
  },

  // ---- Sam: shoulder ROM strong ----
  {
    id: 'ar-sam-rom-1',
    patientId: 'p-sam',
    type: 'shoulder-rom',
    date: '2026-06-27',
    score: 82,
    metrics: [
      { key: 'peakAbd', label: 'Peak abduction', value: 156, unit: '°', delta: 9, betterWhen: 'higher' },
      { key: 'lrDiff', label: 'Side difference', value: 8, unit: '%', delta: -4, betterWhen: 'lower' },
      { key: 'smooth', label: 'Smoothness', value: 88, unit: '/100', delta: 5, betterWhen: 'higher' },
    ],
    improved: ['Peak range up 9° since last check', 'Sides nearly symmetric'],
    keepWorkingOn: ['End-range control above 150°'],
  },
]

export const resultsForPatient = (patientId: string) =>
  ASSESSMENT_RESULTS.filter((r) => r.patientId === patientId).sort((a, b) =>
    b.date.localeCompare(a.date),
  )

export const latestResultFor = (patientId: string, type: AssessmentType) =>
  resultsForPatient(patientId).find((r) => r.type === type) ?? null

export const resultById = (id: string): AssessmentResult => {
  const found = ASSESSMENT_RESULTS.find((r) => r.id === id)
  if (!found) throw new Error(`Unknown assessment result: ${id}`)
  return found
}
