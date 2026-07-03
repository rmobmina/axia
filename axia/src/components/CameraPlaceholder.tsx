import { Camera, ScanLine } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CameraPlaceholderProps {
  /** Visual state of the capture surface. */
  state?: 'idle' | 'countdown' | 'recording'
  countdownValue?: number
  className?: string
}

/**
 * Placeholder for the patient camera / recording surface.
 *
 * TODO(cv-pipeline): replace with a real capture component —
 *   1. getUserMedia video preview
 *   2. MediaRecorder upload to POST /api/recordings (chunked)
 *   3. live on-device pose overlay (MediaPipe Pose / MoveNet via WASM)
 *   4. server-side OpenCV post-processing via the async job queue
 * Keep this component's props (state machine) — the real version swaps in
 * behind the same interface.
 */
export function CameraPlaceholder({
  state = 'idle',
  countdownValue,
  className,
}: CameraPlaceholderProps) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-navy-950 text-center',
        className,
      )}
    >
      {/* Faux camera noise/grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #8DA9C4 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />

      {state === 'recording' && (
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-alert-600 px-2.5 py-1 text-xs font-bold text-white">
          <span className="size-2 animate-pulse rounded-full bg-white" aria-hidden="true" />
          REC
        </span>
      )}

      {state === 'countdown' && countdownValue !== undefined ? (
        <p className="relative text-7xl font-bold text-white tabular-nums" aria-live="assertive">
          {countdownValue}
        </p>
      ) : (
        <div className="relative flex flex-col items-center gap-2 px-6">
          {state === 'recording' ? (
            <ScanLine className="size-8 text-mist-400" aria-hidden="true" />
          ) : (
            <Camera className="size-8 text-mist-400" aria-hidden="true" />
          )}
          <p className="text-sm font-semibold text-mist-200">
            {state === 'recording' ? 'Tracking your movement…' : 'Your camera preview will appear here'}
          </p>
          <p className="text-xs text-mist-400">
            {state === 'recording'
              ? 'Keep your whole body in frame'
              : 'Camera capture arrives with the analysis update'}
          </p>
        </div>
      )}
    </div>
  )
}
