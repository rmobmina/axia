import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarClock,
  ClipboardPen,
  Flag,
  Footprints,
  PersonStanding,
  Ruler,
  Send,
} from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { api } from '@/services/api'
import { exerciseById } from '@/mocks/exercises'
import { assessmentById } from '@/mocks/assessments'
import { formatDate, formatDateFull } from '@/lib/utils'
import type { NoteMessage } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatCard } from '@/components/StatCard'
import { RiskBadge, SeverityBadge, PlanItemStatusBadge } from '@/components/StatusBadge'
import { TrendChart } from '@/components/charts/TrendChart'
import { cn } from '@/lib/utils'

export function PatientDetailPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()

  const { data: patient } = useApi(() => api.getPatient(patientId!), [patientId])
  const { data: plan } = useApi(() => api.getPlan(patientId!), [patientId])
  const { data: sessions } = useApi(() => api.listSessions(patientId!), [patientId])
  const { data: results } = useApi(() => api.listAssessmentResults(patientId!), [patientId])
  const { data: alerts } = useApi(() => api.listAlertsForPatient(patientId!), [patientId])
  const { data: notes } = useApi(() => api.listNotes(patientId!), [patientId])
  const { data: progress } = useApi(() => api.getWeeklyProgress(patientId!), [patientId])

  const [draft, setDraft] = useState('')
  const [localNotes, setLocalNotes] = useState<NoteMessage[]>([])
  const [saving, setSaving] = useState(false)

  if (!patient) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  const latestGait = results?.find((r) => r.type === 'gait')
  const latestSts = results?.find((r) => r.type === 'sit-to-stand')
  const latestBalance = results?.find((r) => r.type === 'balance')
  const latestRom = results?.find((r) => r.type === 'shoulder-rom')
  const scoreHistory = [...(results ?? [])]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => ({ date: r.date, score: r.score }))

  const allNotes = [...localNotes, ...(notes ?? [])]

  const saveNote = async () => {
    if (!draft.trim()) return
    setSaving(true)
    await api.saveNote(patient.id, draft)
    setLocalNotes((prev) => [
      {
        id: `local-${Date.now()}`,
        patientId: patient.id,
        from: 'clinician',
        authorName: 'Dr. Priya Raman',
        date: new Date().toISOString().slice(0, 10),
        text: draft.trim(),
      },
      ...prev,
    ])
    setDraft('')
    setSaving(false)
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <Link
          to="/clinician/patients"
          className="inline-flex size-11 items-center justify-center rounded-xl text-navy-800 hover:bg-mist-100"
          aria-label="Back to patients"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Link>
        <Avatar name={patient.name} className="size-14 text-lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink-900">{patient.name}</h1>
            <RiskBadge level={patient.riskLevel} />
          </div>
          <p className="text-sm text-ink-400">
            {patient.age} yrs · {patient.condition}
            {patient.surgeryDate && ` · surgery ${formatDate(patient.surgeryDate)}`}
          </p>
        </div>
        <Button onClick={() => navigate(`/clinician/patients/${patient.id}/assign`)}>
          <ClipboardPen aria-hidden="true" /> Assign plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="7-day adherence"
          value={patient.adherence7d}
          unit="%"
          delta={patient.id === 'p-arthur' ? -10 : 4}
          deltaLabel="wk"
        />
        <StatCard
          label="Mobility score"
          value={patient.mobilityScore}
          unit="/100"
          delta={patient.mobilityDelta}
          deltaLabel="30d"
        />
        <StatCard label="Last active" value={formatDate(patient.lastActiveDate)} />
        <StatCard
          label="Next check-in"
          value={patient.nextCheckIn ? formatDate(patient.nextCheckIn) : '—'}
          icon={<CalendarClock aria-hidden="true" />}
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions{sessions ? ` (${sessions.length})` : ''}</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* ---------------- Overview ---------------- */}
        <TabsContent value="overview" className="mt-5 space-y-6">
          {alerts && alerts.length > 0 && (
            <div className="space-y-2.5">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className={cn(
                    'flex flex-wrap items-start gap-3 rounded-2xl border p-4',
                    a.severity === 'serious'
                      ? 'border-alert-600/25 bg-alert-100/50'
                      : a.severity === 'warning'
                        ? 'border-warn-600/25 bg-warn-100/50'
                        : 'border-mist-200 bg-mist-50',
                  )}
                >
                  <SeverityBadge severity={a.severity} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink-900">{a.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-600">{a.detail}</p>
                  </div>
                  <span className="text-xs font-semibold text-ink-400">{formatDate(a.date)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mobility score trend</CardTitle>
              </CardHeader>
              <CardContent>
                {progress && progress.length > 0 ? (
                  <TrendChart
                    data={progress}
                    xKey="weekOf"
                    series={[{ key: 'mobilityScore', label: 'Mobility', color: 'var(--color-chart-1)' }]}
                    height={220}
                  />
                ) : scoreHistory.length >= 2 ? (
                  <TrendChart
                    data={scoreHistory}
                    xKey="date"
                    series={[{ key: 'score', label: 'Assessment score', color: 'var(--color-chart-1)' }]}
                    height={220}
                  />
                ) : (
                  <p className="py-8 text-center text-sm text-ink-400">
                    Not enough data yet for a trend.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Assigned plan</CardTitle>
                {plan && <Badge variant="accent">{plan.stage}</Badge>}
              </CardHeader>
              <CardContent className="space-y-2">
                {!plan && <Skeleton className="h-40" />}
                {plan && (
                  <>
                    <p className="pb-1 text-sm font-semibold text-ink-600">{plan.name}</p>
                    {plan.items.map((item) => {
                      const ex = exerciseById(item.exerciseId)
                      return (
                        <div
                          key={item.exerciseId}
                          className="flex items-center justify-between gap-3 rounded-xl border border-mist-200/70 px-3.5 py-2.5"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-ink-900">{ex.name}</p>
                            <p className="text-xs text-ink-400">
                              {item.sets} × {item.reps}
                              {item.holdSeconds ? ` · ${item.holdSeconds}s hold` : ''} · {item.frequency}
                            </p>
                          </div>
                          <PlanItemStatusBadge status={item.status} />
                        </div>
                      )
                    })}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Functional summary */}
          <section aria-labelledby="functional-heading">
            <h2 id="functional-heading" className="mb-3 text-lg font-bold text-ink-900">
              Functional summary
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="Gait speed"
                value={latestGait?.metrics.find((m) => m.key === 'speed')?.value ?? '—'}
                unit={latestGait ? 'm/s' : undefined}
                delta={latestGait?.metrics.find((m) => m.key === 'speed')?.delta}
                icon={<Footprints aria-hidden="true" />}
              />
              <StatCard
                label="5x sit-to-stand"
                value={latestSts?.metrics.find((m) => m.key === 'totalTime')?.value ?? '—'}
                unit={latestSts ? 's' : undefined}
                delta={latestSts?.metrics.find((m) => m.key === 'totalTime')?.delta}
                betterWhen="lower"
                icon={<PersonStanding aria-hidden="true" />}
              />
              <StatCard
                label="Balance (weak side)"
                value={latestBalance?.metrics.find((m) => m.key === 'holdRight')?.value ?? '—'}
                unit={latestBalance ? 's' : undefined}
                icon={<PersonStanding aria-hidden="true" />}
              />
              <StatCard
                label="Shoulder ROM"
                value={latestRom?.metrics.find((m) => m.key === 'peakAbd')?.value ?? '—'}
                unit={latestRom ? '°' : undefined}
                delta={latestRom?.metrics.find((m) => m.key === 'peakAbd')?.delta}
                icon={<Ruler aria-hidden="true" />}
              />
            </div>
          </section>
        </TabsContent>

        {/* ---------------- Sessions ---------------- */}
        <TabsContent value="sessions" className="mt-5">
          <Card>
            <CardContent className="space-y-2.5 p-5">
              {!sessions && <Skeleton className="h-48" />}
              {sessions?.map((s) => {
                const ex = exerciseById(s.exerciseId)
                return (
                  <Link
                    key={s.id}
                    to={`/clinician/reviews/${s.id}`}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border border-mist-200/70 px-4 py-3 hover:bg-mist-50"
                  >
                    <div className="min-w-40">
                      <p className="font-bold text-ink-900">{ex.name}</p>
                      <p className="text-xs text-ink-400">{formatDateFull(s.date)}</p>
                    </div>
                    <p className="text-sm text-ink-600 tabular-nums">
                      {s.repsCompleted}/{s.targetReps} reps
                    </p>
                    <p className="text-sm text-ink-600 tabular-nums">form {s.formScore}/100</p>
                    <p className="text-sm text-ink-600 tabular-nums">sym {s.symmetryPct}%</p>
                    <span className="ml-auto flex items-center gap-2">
                      {s.flagged && (
                        <Badge variant="alert">
                          <Flag aria-hidden="true" /> Flagged
                        </Badge>
                      )}
                      {s.reviewed ? (
                        <Badge variant="outline">Reviewed</Badge>
                      ) : (
                        <Badge variant="accent">Needs review</Badge>
                      )}
                    </span>
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- Assessments ---------------- */}
        <TabsContent value="assessments" className="mt-5 space-y-6">
          {scoreHistory.length >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Assessment scores over time</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendChart
                  data={scoreHistory}
                  xKey="date"
                  series={[{ key: 'score', label: 'Score', color: 'var(--color-chart-1)' }]}
                  height={200}
                />
              </CardContent>
            </Card>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            {results?.map((r) => (
              <Card key={r.id}>
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle>{assessmentById(r.type).name}</CardTitle>
                    <p className="mt-0.5 text-sm text-ink-400">{formatDateFull(r.date)}</p>
                  </div>
                  <Badge variant="navy" className="text-sm">
                    {r.score}/100
                  </Badge>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-3">
                    {r.metrics.map((m) => (
                      <div key={m.key} className="rounded-xl bg-mist-50 p-3">
                        <dt className="text-xs font-semibold text-ink-400">{m.label}</dt>
                        <dd className="mt-0.5 font-bold text-ink-900 tabular-nums">
                          {m.value}
                          {m.unit}
                          {m.delta !== undefined && (
                            <span
                              className={cn(
                                'ml-1.5 text-xs font-bold',
                                (m.betterWhen === 'higher' ? m.delta > 0 : m.delta < 0)
                                  ? 'text-good-700'
                                  : 'text-alert-700',
                              )}
                            >
                              {m.delta > 0 ? '+' : ''}
                              {m.delta}
                            </span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            ))}
            {results && results.length === 0 && (
              <p className="text-sm text-ink-400">No assessments recorded yet.</p>
            )}
          </div>
        </TabsContent>

        {/* ---------------- Notes ---------------- */}
        <TabsContent value="notes" className="mt-5 space-y-5">
          <Card>
            <CardContent className="p-5">
              <label htmlFor="new-note" className="mb-2 block text-sm font-bold text-ink-900">
                Add a note for {patient.name.split(' ')[0]}
              </label>
              <Textarea
                id="new-note"
                rows={3}
                placeholder="Visible to the patient in their home dashboard…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className="mt-3 flex justify-end">
                <Button onClick={saveNote} disabled={saving || !draft.trim()}>
                  <Send aria-hidden="true" /> {saving ? 'Sending…' : 'Send note'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <ol className="relative space-y-4 border-l-2 border-mist-200 pl-6">
            {allNotes.map((n) => (
              <li key={n.id} className="relative">
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute top-1.5 -left-[31px] size-3 rounded-full ring-4 ring-mist-50',
                    n.from === 'clinician'
                      ? 'bg-navy-700'
                      : n.from === 'patient'
                        ? 'bg-mist-400'
                        : 'bg-mist-300',
                  )}
                />
                <div className="rounded-2xl border border-mist-200/70 bg-white p-4 shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-ink-900">{n.authorName}</p>
                    <p className="text-xs font-semibold text-ink-400">{formatDate(n.date)}</p>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{n.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>
      </Tabs>
    </div>
  )
}
