import { useState } from 'react'
import { BellRing, Building2, SlidersHorizontal } from 'lucide-react'
import { CLINICIAN } from '@/mocks/patients'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

/**
 * Clinician workspace settings (mock UI state).
 * TODO(backend): persist notification prefs and alert thresholds per user.
 */
export function ClinicianSettingsPage() {
  const [flagEmail, setFlagEmail] = useState(true)
  const [dailyDigest, setDailyDigest] = useState(true)
  const [missedSessions, setMissedSessions] = useState(false)
  const [adherenceThreshold, setAdherenceThreshold] = useState('60%')

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Settings</h1>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Avatar name={CLINICIAN.name} className="size-16 text-xl" />
          <div>
            <h2 className="text-lg font-bold text-ink-900">
              {CLINICIAN.name}, {CLINICIAN.credentials}
            </h2>
            <p className="text-sm text-ink-400">{CLINICIAN.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-5 text-mist-500" aria-hidden="true" /> Clinic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-ink-900">{CLINICIAN.clinic}</p>
          <p className="mt-1 text-sm text-ink-400">6 active patients · 3 programs in use</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="size-5 text-mist-500" aria-hidden="true" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-mist-100">
          {(
            [
              {
                title: 'Concern flag emails',
                desc: 'Immediate email when monitoring raises a serious flag',
                value: flagEmail,
                set: setFlagEmail,
              },
              {
                title: 'Daily review digest',
                desc: 'Morning summary of new submissions and misses',
                value: dailyDigest,
                set: setDailyDigest,
              },
              {
                title: 'Missed session pings',
                desc: 'Notify after a patient misses two consecutive days',
                value: missedSessions,
                set: setMissedSessions,
              },
            ] as const
          ).map((row) => (
            <div key={row.title} className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <p className="font-semibold text-ink-900">{row.title}</p>
                <p className="mt-0.5 text-sm text-ink-400">{row.desc}</p>
              </div>
              <Switch checked={row.value} onCheckedChange={row.set} aria-label={row.title} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-mist-500" aria-hidden="true" /> Alert thresholds
          </CardTitle>
          <p className="text-sm text-ink-400">Flag patients whose 7-day adherence drops below</p>
        </CardHeader>
        <CardContent>
          <div role="group" aria-label="Adherence threshold" className="flex flex-wrap gap-2">
            {['50%', '60%', '70%', '80%'].map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={adherenceThreshold === t}
                onClick={() => setAdherenceThreshold(t)}
                className={cn(
                  'h-10 cursor-pointer rounded-full px-4 text-sm font-semibold transition-colors',
                  adherenceThreshold === t
                    ? 'bg-navy-700 text-white'
                    : 'bg-mist-100 text-ink-600 hover:bg-mist-200',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
