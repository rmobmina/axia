import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { PoseId } from '@/types'
import { POSES, type JointName, type PoseFrame } from './poses'

/**
 * SkeletonGuide — the animated reference "dummy" that demonstrates each
 * movement to the patient. Renders a stylized line figure and tween-loops
 * through the pose's keyframes, with optional highlighted joints and a
 * dashed target-range arc.
 *
 * TODO(cv-pipeline): this component is the playback surface for real
 * reference motion. When pose-sequence JSON (MediaPipe/MoveNet keypoints)
 * exists, add a `frames` prop that overrides the built-in POSES lookup —
 * nothing else here needs to change. A second instance can later render the
 * patient's own tracked skeleton for side-by-side comparison.
 */

const BONES: [JointName, JointName][] = [
  ['neck', 'shoulderL'],
  ['neck', 'shoulderR'],
  ['shoulderL', 'elbowL'],
  ['elbowL', 'wristL'],
  ['shoulderR', 'elbowR'],
  ['elbowR', 'wristR'],
  ['neck', 'pelvis'],
  ['pelvis', 'hipL'],
  ['pelvis', 'hipR'],
  ['hipL', 'kneeL'],
  ['kneeL', 'ankleL'],
  ['ankleL', 'footL'],
  ['hipR', 'kneeR'],
  ['kneeR', 'ankleR'],
  ['ankleR', 'footR'],
]

const JOINTS: JointName[] = [
  'neck',
  'shoulderL',
  'shoulderR',
  'elbowL',
  'elbowR',
  'wristL',
  'wristR',
  'pelvis',
  'hipL',
  'hipR',
  'kneeL',
  'kneeR',
  'ankleL',
  'ankleR',
]

/** Screen-space polar (y down): 0° = right, 90° = down. */
function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const [sx, sy] = polar(cx, cy, r, startDeg)
  const [ex, ey] = polar(cx, cy, r, endDeg)
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  const sweep = endDeg > startDeg ? 1 : 0
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${r} ${r} 0 ${largeArc} ${sweep} ${ex.toFixed(1)} ${ey.toFixed(1)}`
}

interface SkeletonGuideProps {
  poseId: PoseId
  /** Pause the demo loop (also paused automatically for reduced motion). */
  playing?: boolean
  /** Show the dashed target-range arc if the pose defines one. */
  showTargetArc?: boolean
  className?: string
  /** Accessible description, e.g. "Demonstration of Mini Squats". */
  label?: string
  /** Color scheme: 'dark' for rendering on navy surfaces. */
  tone?: 'light' | 'dark'
}

const TONES = {
  light: {
    bone: 'var(--color-navy-700)',
    headFill: 'var(--color-mist-200)',
    headStroke: 'var(--color-navy-700)',
    jointFill: 'white',
    jointStroke: 'var(--color-mist-500)',
    floor: 'var(--color-mist-300)',
    prop: 'var(--color-mist-400)',
    arc: 'var(--color-mist-500)',
    arcText: 'var(--color-ink-400)',
  },
  dark: {
    bone: 'var(--color-mist-200)',
    headFill: 'var(--color-navy-800)',
    headStroke: 'var(--color-mist-200)',
    jointFill: 'var(--color-navy-950)',
    jointStroke: 'var(--color-mist-300)',
    floor: 'rgba(141, 169, 196, 0.45)',
    prop: 'var(--color-mist-500)',
    arc: 'var(--color-mist-400)',
    arcText: 'var(--color-mist-300)',
  },
} as const

export function SkeletonGuide({
  poseId,
  playing = true,
  showTargetArc = true,
  className,
  label,
  tone = 'light',
}: SkeletonGuideProps) {
  const c = TONES[tone]
  const reducedMotion = useReducedMotion()
  const pose = POSES[poseId] ?? POSES.idle
  const animate = playing && !reducedMotion && pose.frames.length > 1
  // When paused, freeze on the most demonstrative frame (the last keyframe).
  const still: PoseFrame = animate ? pose.frames[0] : pose.frames[pose.frames.length - 1]

  const transition = {
    duration: pose.cycleSeconds,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut' as const,
  }

  const track = (joint: JointName, axis: 0 | 1) =>
    animate ? pose.frames.map((f) => f[joint][axis]) : still[joint][axis]

  const arc = pose.arc
  const arcCenter = arc ? pose.frames[0][arc.joint] : null

  return (
    <svg
      viewBox="0 0 200 240"
      role="img"
      aria-label={label ?? 'Animated exercise demonstration'}
      className={cn('h-full w-full', className)}
    >
      {/* Stage */}
      <line x1="16" y1="212" x2="184" y2="212" stroke={c.floor} strokeWidth="2" strokeLinecap="round" />

      {pose.prop === 'chair' && (
        <g stroke={c.prop} strokeWidth="4" strokeLinecap="round" opacity="0.85">
          <line x1="66" y1="146" x2="106" y2="146" />
          <line x1="70" y1="146" x2="70" y2="210" />
          <line x1="102" y1="146" x2="102" y2="210" />
          <line x1="66" y1="146" x2="66" y2="96" />
        </g>
      )}

      {/* Target-range arc */}
      {showTargetArc && arc && arcCenter && (
        <g>
          <path
            d={arcPath(arcCenter[0], arcCenter[1], arc.radius, arc.startDeg, arc.endDeg)}
            fill="none"
            stroke={c.arc}
            strokeWidth="2"
            strokeDasharray="4 5"
            strokeLinecap="round"
          />
          <text
            x={polar(arcCenter[0], arcCenter[1], arc.radius + 10, arc.endDeg)[0]}
            y={polar(arcCenter[0], arcCenter[1], arc.radius + 10, arc.endDeg)[1]}
            fontSize="9"
            fontWeight="600"
            fill={c.arcText}
            textAnchor="middle"
          >
            {arc.label}
          </text>
        </g>
      )}

      {/* Bones */}
      {BONES.map(([a, b]) => (
        <motion.line
          key={`${a}-${b}`}
          stroke={c.bone}
          strokeWidth="5.5"
          strokeLinecap="round"
          initial={false}
          animate={{ x1: track(a, 0), y1: track(a, 1), x2: track(b, 0), y2: track(b, 1) }}
          transition={transition}
        />
      ))}

      {/* Head */}
      <motion.circle
        r="12"
        fill={c.headFill}
        stroke={c.headStroke}
        strokeWidth="4"
        initial={false}
        animate={{ cx: track('head', 0), cy: track('head', 1) }}
        transition={transition}
      />

      {/* Joints */}
      {JOINTS.map((j) => (
        <motion.circle
          key={j}
          r="3.2"
          fill={c.jointFill}
          stroke={c.jointStroke}
          strokeWidth="1.5"
          initial={false}
          animate={{ cx: track(j, 0), cy: track(j, 1) }}
          transition={transition}
        />
      ))}

      {/* Highlighted joints — soft pulsing focus rings */}
      {pose.highlight?.map((j) => (
        <motion.circle
          key={`hl-${j}`}
          r="9"
          fill="none"
          stroke="var(--color-chart-2)"
          strokeWidth="2.5"
          initial={false}
          animate={{
            cx: track(j, 0),
            cy: track(j, 1),
            opacity: animate ? [0.9, 0.35] : 0.7,
          }}
          transition={transition}
        />
      ))}
    </svg>
  )
}

/** Alias kept for readability at call sites that present it as a "player". */
export const PoseDemoPlayer = SkeletonGuide
