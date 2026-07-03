import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock3, Flag, PlayCircle, Send } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { api } from '@/services/api'
import { patientById } from '@/mocks/patients'
import { exerciseById } from '@/mocks/exercises'
import { formatDateFull, formatSeconds } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/input'
import { StatCard } from '@/components/StatCard'
import { SymmetryBar } from '@/components/charts/SymmetryBar'
import { SkeletonGuide } from '@/components/skeleton/SkeletonGuide'

export function SessionReviewPage() {
  const { sessionId } = useParams()
  const { data: session } = useApi(() => api.getSession(sessionId!), [sessionId])
  const [comment, setComment] = useState('')
  const [reviewed, setReviewed] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!session) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16" />
        <Skeleton className="h-80" />
      </div>
    )
  }

  const patient = patientById(session.patientId)
  const exercise = exerciseById(session.exerciseId)
  const isReviewed = reviewed || session.reviewed

  // Mock "key moments" timeline derived from the session's form notes.
  // TODO(cv-pipeline): real key moments come from the analysis output with
  // frame-accurate timestamps and a thumbnail per event.
  const keyMoments = session.formNotes.map((note, i) => ({
    at: Math.round(((i + 1) / (session.formNotes.length + 1)) * session.durationMin * 60),
    note,
  }))

  const markReviewed = async () => {
    setSaving(true)
    await api.markSessionReviewed(session.id)
    if (comment.trim()) await api.saveNote(session.patientId, comment)
    setReviewed(true)
    setSaving(false)
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <Link
          to="/clinician/reviews"
          className="inline-flex size-11 items-center justify-center rounded-xl text-navy-800 hover:bg-mist-100"
          aria-label="Back to reviews"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Link>
        <Avatar name={patient.name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink-900">{exercise.name}</h1>
            {session.flagged && (
              <Badge variant="alert">
                <Flag aria-hidden="true" /> {session.flagReason}
              </Badge>
            )}
            {isReviewed && (
              <Badge variant="good">
                <CheckCircle2 aria-hidden="true" /> Reviewed
              </Badge>
            )}
          </div>
          <p className="text-sm text-ink-400">
            <Link to={`/clinician/patients/${patient.id}`} className="font-semibold text-navy-700 hover:underline">
              {patient.name}
            </Link>{' '}
            · {formatDateFull(session.date)} · {session.durationMin} min session
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Video placeholder */}
        <div className="space-y-4">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-navy-950">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #8DA9C4 1px, transparent 0)',
                backgroundSize: '22px 22px',
              }}
            />
            <div className="absolute top-1/2 left-1/2 h-40 w-32 -translate-x-1/2 -translate-y-1/2 opacity-70">
              <SkeletonGuide
                poseId={exercise.poseId}
                playing={false}
                tone="dark"
                label=""
                showTargetArc={false}
              />
            </div>
            <div className="relative flex flex-col items-center gap-2 rounded-2xl bg-navy-950/70 px-6 py-4 backdrop-blur-sm">
              <PlayCircle className="size-10 text-mist-300" aria-hidden="true" />
              <p className="text-sm font-semibold text-mist-200">Session recording</p>
              <p className="text-xs text-mist-400">
                Video playback arrives with the capture pipeline
              </p>
            </div>
          </div>

          {/* Key moments */}
          <Card>
            <CardHeader>
              <CardTitle>Key moments</CardTitle>
              <p className="text-sm text-ink-400">Auto-detected form events from this session</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {keyMoments.map((m) => (
                <button
                  key={m.at}
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-mist-200/70 px-3.5 py-2.5 text-left hover:bg-mist-50"
                  title="Jumps to this timestamp once video playback exists"
                >
                  <Badge variant="navy" className="tabular-nums">
                    <Clock3 aria-hidden="true" /> {formatSeconds(m.at)}
                  </Badge>
                  <span className="text-sm font-semibold text-ink-600">{m.note}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Metrics + review */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Reps completed"
              value={`${session.repsCompleted}/${session.targetReps}`}
            />
            <StatCard label="Form score" value={session.formScore} unit="/100" />
            <StatCard
              label="Avg range"
              value={session.avgRomDeg}
              unit={`° / ${session.targetRomDeg}°`}
            />
            <StatCard label="Best rep" value={session.bestRomDeg} unit="°" />
          </div>

          <Card>
            <CardContent className="p-5">
              <p className="mb-3 text-sm font-bold text-ink-900">Left / right symmetry</p>
              <SymmetryBar value={session.symmetryPct} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <label htmlFor="review-comment" className="mb-2 block text-sm font-bold text-ink-900">
                Comment to patient
              </label>
              <Textarea
                id="review-comment"
                rows={4}
                placeholder={`e.g. Nice control on the descent, ${patient.name.split(' ')[0]} — let’s aim for a touch more depth next week.`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isReviewed}
              />
              <Button
                size="lg"
                className="mt-4 w-full"
                variant={isReviewed ? 'success' : 'primary'}
                disabled={isReviewed || saving}
                onClick={markReviewed}
              >
                {isReviewed ? (
                  <>
                    <CheckCircle2 aria-hidden="true" /> Marked as reviewed
                  </>
                ) : saving ? (
                  'Saving…'
                ) : (
                  <>
                    <Send aria-hidden="true" /> Send comment & mark reviewed
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
