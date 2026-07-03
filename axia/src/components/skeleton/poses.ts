import type { PoseId } from '@/types'

/**
 * Reference pose keyframes for <SkeletonGuide />.
 *
 * Each pose is a small set of 2D joint keyframes (SVG viewBox 0 0 200 240,
 * floor at y=212). The guide tween-loops through them.
 *
 * TODO(cv-pipeline): replace these hand-authored frames with real reference
 * pose sequences exported from MediaPipe/MoveNet (33/17-keypoint JSON at
 * 15–30fps). The component API is already frame-based, so playback of real
 * sequences only requires mapping landmark names → JointName and resampling.
 */

export type JointName =
  | 'head'
  | 'neck'
  | 'shoulderL'
  | 'shoulderR'
  | 'elbowL'
  | 'elbowR'
  | 'wristL'
  | 'wristR'
  | 'pelvis'
  | 'hipL'
  | 'hipR'
  | 'kneeL'
  | 'kneeR'
  | 'ankleL'
  | 'ankleR'
  | 'footL'
  | 'footR'

export type PoseFrame = Record<JointName, [number, number]>

export interface TargetArc {
  joint: JointName
  radius: number
  /** Screen-space degrees: 0° = right, 90° = down (y axis points down). */
  startDeg: number
  endDeg: number
  label: string
}

export interface PoseDef {
  frames: PoseFrame[]
  /** Seconds for one forward pass through the frames (loops with reverse). */
  cycleSeconds: number
  prop?: 'chair' | 'floor'
  highlight?: JointName[]
  arc?: TargetArc
}

const STAND: PoseFrame = {
  head: [100, 44],
  neck: [100, 60],
  shoulderL: [83, 68],
  shoulderR: [117, 68],
  elbowL: [78, 98],
  elbowR: [122, 98],
  wristL: [74, 126],
  wristR: [126, 126],
  pelvis: [100, 126],
  hipL: [91, 128],
  hipR: [109, 128],
  kneeL: [89, 166],
  kneeR: [111, 166],
  ankleL: [88, 204],
  ankleR: [112, 204],
  footL: [79, 211],
  footR: [121, 211],
}

const SQUAT_DOWN: PoseFrame = {
  ...STAND,
  head: [100, 72],
  neck: [100, 88],
  shoulderL: [83, 96],
  shoulderR: [117, 96],
  elbowL: [70, 118],
  elbowR: [130, 118],
  wristL: [58, 134],
  wristR: [142, 134],
  pelvis: [100, 148],
  hipL: [90, 150],
  hipR: [110, 150],
  kneeL: [78, 178],
  kneeR: [122, 178],
}

const ARMS_RAISED: PoseFrame = {
  ...STAND,
  elbowL: [55, 58],
  wristL: [30, 44],
  elbowR: [145, 58],
  wristR: [170, 44],
}

const SEATED: PoseFrame = {
  head: [86, 60],
  neck: [87, 76],
  shoulderL: [86, 84],
  shoulderR: [88, 84],
  elbowL: [92, 108],
  elbowR: [94, 108],
  wristL: [100, 128],
  wristR: [102, 128],
  pelvis: [92, 138],
  hipL: [90, 140],
  hipR: [94, 140],
  kneeL: [126, 144],
  kneeR: [130, 144],
  ankleL: [122, 184],
  ankleR: [126, 184],
  footL: [134, 189],
  footR: [138, 189],
}

const KNEE_EXTENDED: PoseFrame = {
  ...SEATED,
  kneeR: [130, 144],
  ankleR: [168, 152],
  footR: [180, 146],
}

const STS_LEAN: PoseFrame = {
  ...SEATED,
  head: [104, 74],
  neck: [102, 88],
  shoulderL: [100, 94],
  shoulderR: [102, 94],
  elbowL: [106, 114],
  elbowR: [108, 114],
  wristL: [112, 130],
  wristR: [114, 130],
  pelvis: [92, 134],
}

const STAND_SIDE: PoseFrame = {
  head: [98, 48],
  neck: [99, 64],
  shoulderL: [98, 72],
  shoulderR: [100, 72],
  elbowL: [101, 100],
  elbowR: [103, 100],
  wristL: [103, 126],
  wristR: [105, 126],
  pelvis: [99, 130],
  hipL: [98, 132],
  hipR: [100, 132],
  kneeL: [100, 168],
  kneeR: [103, 168],
  ankleL: [98, 204],
  ankleR: [101, 204],
  footL: [111, 210],
  footR: [114, 210],
}

const BALANCE_HOLD: PoseFrame = {
  ...STAND,
  elbowL: [62, 74],
  wristL: [44, 66],
  elbowR: [138, 74],
  wristR: [156, 66],
  pelvis: [102, 126],
  hipR: [111, 128],
  kneeL: [92, 158],
  ankleL: [96, 182],
  footL: [88, 190],
}

const shiftY = (pose: PoseFrame, dy: number): PoseFrame =>
  Object.fromEntries(
    Object.entries(pose).map(([k, [x, y]]) => [k, [x, y + dy]]),
  ) as PoseFrame

const HEEL_RAISE_UP: PoseFrame = {
  ...shiftY(STAND, -8),
  ankleL: [88, 196],
  ankleR: [112, 196],
  footL: [79, 208],
  footR: [121, 208],
}

const BRIDGE_DOWN: PoseFrame = {
  head: [34, 196],
  neck: [48, 199],
  shoulderL: [52, 200],
  shoulderR: [54, 200],
  elbowL: [62, 206],
  elbowR: [64, 206],
  wristL: [72, 208],
  wristR: [74, 208],
  pelvis: [96, 202],
  hipL: [94, 202],
  hipR: [98, 202],
  kneeL: [124, 172],
  kneeR: [128, 172],
  ankleL: [136, 204],
  ankleR: [140, 204],
  footL: [148, 206],
  footR: [152, 206],
}

const BRIDGE_UP: PoseFrame = {
  ...BRIDGE_DOWN,
  pelvis: [96, 176],
  hipL: [94, 176],
  hipR: [98, 176],
}

const GAIT_A: PoseFrame = {
  ...STAND_SIDE,
  elbowL: [88, 98],
  wristL: [84, 122],
  elbowR: [112, 98],
  wristR: [118, 120],
  kneeL: [86, 166],
  ankleL: [78, 200],
  footL: [70, 208],
  kneeR: [114, 164],
  ankleR: [120, 200],
  footR: [132, 204],
}

const GAIT_B: PoseFrame = {
  ...STAND_SIDE,
  elbowL: [112, 98],
  wristL: [118, 120],
  elbowR: [88, 98],
  wristR: [84, 122],
  kneeL: [114, 164],
  ankleL: [120, 200],
  footL: [132, 204],
  kneeR: [86, 166],
  ankleR: [78, 200],
  footR: [70, 208],
}

export const POSES: Record<PoseId, PoseDef> = {
  idle: {
    frames: [STAND, shiftY(STAND, -2)],
    cycleSeconds: 3,
  },
  squat: {
    frames: [STAND, SQUAT_DOWN],
    cycleSeconds: 3.4,
    highlight: ['kneeL', 'kneeR'],
  },
  'sit-to-stand': {
    frames: [SEATED, STS_LEAN, STAND_SIDE],
    cycleSeconds: 3.8,
    prop: 'chair',
    highlight: ['hipL', 'hipR'],
  },
  'shoulder-abduction': {
    frames: [STAND, ARMS_RAISED, ARMS_RAISED],
    cycleSeconds: 4,
    highlight: ['shoulderL', 'shoulderR'],
    arc: { joint: 'shoulderR', radius: 42, startDeg: 82, endDeg: -42, label: 'Target 160°' },
  },
  'knee-extension': {
    frames: [SEATED, KNEE_EXTENDED, KNEE_EXTENDED],
    cycleSeconds: 3.6,
    prop: 'chair',
    highlight: ['kneeR'],
    arc: { joint: 'kneeR', radius: 34, startDeg: 82, endDeg: 8, label: 'Target range' },
  },
  balance: {
    frames: [STAND, BALANCE_HOLD, BALANCE_HOLD, BALANCE_HOLD],
    cycleSeconds: 5,
    highlight: ['ankleR'],
  },
  'heel-raise': {
    frames: [STAND, HEEL_RAISE_UP, HEEL_RAISE_UP],
    cycleSeconds: 2.8,
    highlight: ['ankleL', 'ankleR'],
  },
  bridge: {
    frames: [BRIDGE_DOWN, BRIDGE_UP, BRIDGE_UP],
    cycleSeconds: 3.4,
    prop: 'floor',
    highlight: ['hipL', 'hipR'],
  },
  gait: {
    frames: [GAIT_A, GAIT_B],
    cycleSeconds: 1.6,
  },
}
