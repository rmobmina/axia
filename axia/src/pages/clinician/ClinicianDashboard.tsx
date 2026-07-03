import { Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  ClipboardCheck,
  Flag,
  TrendingDown,
  Users,
} from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { api } from '@/services/api'
import { CLINICIAN, DEMO_TODAY, patientById } from '@/mocks/patients'
import { exerciseById } from '@/mocks/exercises'
import { formatDate, formatDateFull } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/StatCard'
import { SeverityBadge } from '@/components/StatusBadge'
import { Sparkline } from '@/components/charts/Sparkline'

export function ClinicianDashboard() {
  const navigate = useNavigate()
  const { data: patients } = useApi(() => api.listPatients())
  const { data: alerts } = useApi(() => api.listAlerts())
  const { data: sessions } = useApi(() => api.listSessions())

  const needsReview = sessions?.filter((s) => !s.reviewed) ?? []
  const avgAdherence = patients
    ? Math.round(patients.reduce((sum, p) => sum + p.adherence7d, 0) / patients.length)
    : null
  const declining = patients?.filter((p) => p.mobilityDelta < 0) ?? []
  const actionAlerts = alerts?.filter((a) => a.severity !== 'info') ?? []

  return (
    <div className="space-y-6 pb-6">
      <div>
        <p className="text-sm font-semibold text-ink-400">{formatDateFull(DEMO_TODAY)}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          Welcome back, {CLINICIAN.name.split(' ')[1]}
        </h1>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active patients"
          value={patients?.length ?? '—'}
          icon={<Users aria-hidden="true" />}
        />
        <StatCard
          label="Sessions to review"
          value={sessions ? needsReview.length : '—'}
          icon={<ClipboardCheck aria-hidden="true" />}
        />
        <StatCard
          label="Open concern flags"
          value={alerts ? actionAlerts.length : '—'}
          icon={<Flag aria-hidden="true" />}
        />
        <StatCard
          label="Avg 7-day adherence"
          value={avgAdherence ?? '—'}
          unit="%"
          delta={-3}
          deltaLabel="wk"
          icon={<Activity aria-hidden="true" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Follow-up queue */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Patients requiring follow-up</CardTitle>
              <p className="mt-0.5 text-sm text-ink-400">Concern flags from automated monitoring</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {!alerts && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
            {actionAlerts.map((alert) => {
              const patient = patientById(alert.patientId)
              return (
                <div
                  key={alert.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-mist-200/70 bg-mist-50/50 p-3.5"
                >
                  <Avatar name={patient.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-ink-900">{patient.name}</p>
                      <SeverityBadge severity={alert.severity} />
                    </div>
                    <p className="mt-0.5 text-sm font-semibold text-ink-900">{alert.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-ink-400">{alert.detail}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/clinician/patients/${patient.id}`)}
                  >
                    Open chart <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Declining metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="size-5 text-alert-600" aria-hidden="true" />
                Declining mobility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {!patients && <Skeleton className="h-16" />}
              {declining.length === 0 && patients && (
                <p className="text-sm text-ink-400">No declining trends this week.</p>
              )}
              {declining.map((p) => (
                <Link
                  key={p.id}
                  to={`/clinician/patients/${p.id}`}
                  className="flex items-center gap-3 rounded-xl border border-mist-200/70 p-3 hover:bg-mist-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-ink-900">{p.name}</p>
                    <p className="text-xs text-ink-400">
                      Mobility {p.mobilityScore}/100 · {p.mobilityDelta} in 30d
                    </p>
                  </div>
                  <Sparkline values={p.mobilityTrend} improving={false} />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent submissions */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Recent submissions</CardTitle>
              <Link
                to="/clinician/reviews"
                className="text-sm font-bold text-navy-700 hover:underline"
              >
                Review all
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {!sessions && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
              {needsReview.slice(0, 4).map((s) => (
                <Link
                  key={s.id}
                  to={`/clinician/reviews/${s.id}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-mist-200/70 px-3.5 py-2.5 hover:bg-mist-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink-900">
                      {patientById(s.patientId).name}
                    </p>
                    <p className="truncate text-xs text-ink-400">
                      {exerciseById(s.exerciseId).name} · {formatDate(s.date)}
                    </p>
                  </div>
                  {s.flagged ? (
                    <Badge variant="alert">
                      <Flag aria-hidden="true" /> Flag
                    </Badge>
                  ) : (
                    <Badge variant="outline">{s.formScore}/100</Badge>
                  )}
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Caseload table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Caseload</CardTitle>
          <Link to="/clinician/patients" className="text-sm font-bold text-navy-700 hover:underline">
            All patients
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {patients ? (
            <table className="w-full min-w-160 text-left text-sm">
              <thead>
                <tr className="border-b border-mist-200 text-xs font-bold tracking-wide text-ink-400 uppercase">
                  <th className="py-2.5 pr-4">Patient</th>
                  <th className="py-2.5 pr-4">Adherence</th>
                  <th className="py-2.5 pr-4">Mobility</th>
                  <th className="py-2.5 pr-4">Trend</th>
                  <th className="py-2.5 pr-4">Last active</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr
                    key={p.id}
                    className="cursor-pointer border-b border-mist-100 transition-colors last:border-0 hover:bg-mist-50"
                    onClick={() => navigate(`/clinician/patients/${p.id}`)}
                  >
                    <td className="py-3 pr-4">
                      <Link
                        to={`/clinician/patients/${p.id}`}
                        className="flex items-center gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Avatar name={p.name} className="size-9" />
                        <span>
                          <span className="block font-bold text-ink-900">{p.name}</span>
                          <span className="block text-xs text-ink-400">{p.condition}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-semibold text-ink-900 tabular-nums">
                      {p.adherence7d}%
                    </td>
                    <td className="py-3 pr-4 font-semibold text-ink-900 tabular-nums">
                      {p.mobilityScore}
                      <span className="text-ink-400">/100</span>
                    </td>
                    <td className="py-3 pr-4">
                      <Sparkline values={p.mobilityTrend} improving={p.mobilityDelta >= 0} />
                    </td>
                    <td className="py-3 pr-4 text-ink-400">{formatDate(p.lastActiveDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Skeleton className="h-64" />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
