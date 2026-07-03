import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Accessibility, BellRing, Gauge, LogOut, Stethoscope } from 'lucide-react'
import { CLINICIAN, patientById } from '@/mocks/patients'
import { DEMO_PATIENT_ID, useRole } from '@/context/RoleContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

/**
 * Patient profile & accessibility preferences.
 * TODO(backend): persist preferences per user; text size / reduced motion
 * should also write real settings (root font-size, prefers-reduced-motion
 * override) once product behavior is finalized. Currently mock UI state.
 */

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={cn(
            'h-10 cursor-pointer rounded-full px-4 text-sm font-semibold transition-colors',
            value === o ? 'bg-navy-700 text-white' : 'bg-mist-100 text-ink-600 hover:bg-mist-200',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function SettingRow({
  title,
  description,
  control,
}: {
  title: string
  description: string
  control: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="mt-0.5 text-sm text-ink-400">{description}</p>
      </div>
      {control}
    </div>
  )
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { setRole } = useRole()
  const patient = patientById(DEMO_PATIENT_ID)

  const [textSize, setTextSize] = useState('Standard')
  const [pace, setPace] = useState('Standard')
  const [reminderTime, setReminderTime] = useState('Morning (9:00)')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [voicePrompts, setVoicePrompts] = useState(true)

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Profile</h1>

      {/* Identity */}
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Avatar name={patient.name} className="size-16 text-xl" />
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-ink-900">{patient.name}</h2>
            <p className="text-sm text-ink-400">{patient.condition}</p>
            <Badge variant="accent" className="mt-2">
              {patient.program}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Care team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="size-5 text-mist-500" aria-hidden="true" /> Your care team
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar name={CLINICIAN.name} />
          <div className="min-w-0">
            <p className="font-bold text-ink-900">
              {CLINICIAN.name}, {CLINICIAN.credentials}
            </p>
            <p className="text-sm text-ink-400">{CLINICIAN.clinic}</p>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="size-5 text-mist-500" aria-hidden="true" /> Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-mist-100">
          <div className="py-3.5">
            <p className="mb-2.5 font-semibold text-ink-900">Text size</p>
            <ChipGroup
              label="Text size"
              options={['Standard', 'Large', 'Extra large']}
              value={textSize}
              onChange={setTextSize}
            />
          </div>
          <SettingRow
            title="Reduce motion"
            description="Minimize animations, including the exercise guide loop"
            control={
              <Switch
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
                aria-label="Reduce motion"
              />
            }
          />
          <SettingRow
            title="Higher contrast"
            description="Stronger text and border contrast throughout the app"
            control={
              <Switch
                checked={highContrast}
                onCheckedChange={setHighContrast}
                aria-label="Higher contrast"
              />
            }
          />
          <SettingRow
            title="Spoken coaching"
            description="Read coaching prompts aloud during sessions"
            control={
              <Switch
                checked={voicePrompts}
                onCheckedChange={setVoicePrompts}
                aria-label="Spoken coaching"
              />
            }
          />
        </CardContent>
      </Card>

      {/* Session preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="size-5 text-mist-500" aria-hidden="true" /> Exercise pace
          </CardTitle>
          <p className="text-sm text-ink-400">How quickly guided sessions move between reps</p>
        </CardHeader>
        <CardContent>
          <ChipGroup
            label="Exercise pace"
            options={['Gentle', 'Standard', 'Brisk']}
            value={pace}
            onChange={setPace}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="size-5 text-mist-500" aria-hidden="true" /> Reminders
          </CardTitle>
          <p className="text-sm text-ink-400">When Axia nudges you about today’s plan</p>
        </CardHeader>
        <CardContent>
          <ChipGroup
            label="Reminder time"
            options={['Morning (9:00)', 'Midday (12:30)', 'Evening (18:00)']}
            value={reminderTime}
            onChange={setReminderTime}
          />
        </CardContent>
      </Card>

      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => {
          setRole(null)
          navigate('/')
        }}
      >
        <LogOut aria-hidden="true" /> Sign out of demo
      </Button>
    </div>
  )
}
