import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CircleCheckBig, Flag, Sparkles, Target } from 'lucide-react'
import {
  ASSESSMENT_RESULTS,
  assessmentById,
  resultById,
} from '@/mocks/assessments'
import { DEMO_PATIENT_ID } from '@/context/RoleContext'
import type { AssessmentType } from '@/types'
import { formatDateFull } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/EmptyState'
import { StatCard } from '@/components/StatCard'
import { TrendChart } from '@/components/charts/TrendChart'

export function AssessmentResultsPage() {
  const { type, resultId } = useParams()
  const navigate = useNavigate()
  const assessment = assessmentById(type as AssessmentType)

  const result = useMemo(
    () => (resultId && resultId !== 'baseline' ? resultById(resultId) : null),
    [resultId],
  )

  const history = useMemo(
    () =>
      ASSESSMENT_RESULTS.filter(
        (r) => r.patientId === DEMO_PATIENT_ID && r.type === type,
      )
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((r) => ({ date: r.date, score: r.score })),
    [type],
  )

  if (!result) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 py-6">
        <EmptyState
          icon={<Sparkles aria-hidden="true" />}
          title="Baseline recorded"
          description={`Great start — this first ${assessment.name} becomes your baseline. Your next check-in will show what's changing.`}
          action={
            <Button onClick={() => navigate('/patient/assessments')}>Back to assessments</Button>
          }
        />
      </div>
    )
  }

  const prevScore = history.length > 1 ? history[history.length - 2].score : null

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center gap-3">
        <Link
          to="/patient/assessments"
          className="inline-flex size-11 items-center justify-center rounded-xl text-navy-800 hover:bg-mist-100"
          aria-label="Back to assessments"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">{assessment.name} results</h1>
          <p className="text-sm font-semibold text-ink-400">{formatDateFull(result.date)}</p>
        </div>
      </div>

      {/* Score hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 bg-navy-800 text-white">
          <CardContent className="flex flex-wrap items-center justify-between gap-6 p-6">
            <div>
              <p className="text-xs font-bold tracking-wide text-mist-300 uppercase">
                Mobility score for this check-in
              </p>
              <p className="mt-1 text-5xl font-bold tabular-nums">
                {result.score}
                <span className="text-2xl font-semibold text-mist-300">/100</span>
              </p>
              {prevScore !== null && (
                <Badge variant="onDark" className="mt-3 px-3 py-1.5">
                  {result.score >= prevScore ? '▲' : '▼'} {Math.abs(result.score - prevScore)} points
                  vs last check-in
                </Badge>
              )}
            </div>
            {history.length >= 2 && (
              <div className="min-w-64 flex-1 rounded-xl bg-white/8 p-3">
                <TrendChart
                  data={history}
                  xKey="date"
                  series={[{ key: 'score', label: 'Score', color: 'var(--color-chart-2)' }]}
                  height={140}
                  yDomain={[40, 90]}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Metric cards */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="mb-3 text-lg font-bold text-ink-900">
          What we measured
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {result.metrics.map((m) => (
            <StatCard
              key={m.key}
              label={m.label}
              value={m.value}
              unit={m.unit}
              delta={m.delta}
              betterWhen={m.betterWhen}
              deltaLabel="vs last"
            />
          ))}
        </div>
      </section>

      {/* Improved / keep working on */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-good-700">
              <CircleCheckBig className="size-5" aria-hidden="true" /> What improved
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.improved.length ? (
              <ul className="space-y-2.5">
                {result.improved.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-600">
                    <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-good-600" />
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-400">
                This is your baseline — improvements will show from your next check-in.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-navy-700">
              <Target className="size-5" aria-hidden="true" /> Keep working on
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {result.keepWorkingOn.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-600">
                  <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-navy-700" />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button size="lg" onClick={() => navigate('/patient/progress')}>
          See my progress
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate('/patient/assessments')}>
          <Flag aria-hidden="true" /> Done for now
        </Button>
      </div>
    </div>
  )
}
