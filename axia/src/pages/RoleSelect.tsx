import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, HeartPulse, Stethoscope } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { SkeletonGuide } from '@/components/skeleton/SkeletonGuide'
import { useRole } from '@/context/RoleContext'
import type { Role } from '@/types'

/**
 * Mock sign-in: pick which side of Axia to demo.
 * TODO(backend): replace with real authentication.
 */
export function RoleSelect() {
  const { setRole } = useRole()
  const navigate = useNavigate()

  const choose = (role: Role) => {
    setRole(role)
    navigate(role === 'patient' ? '/patient' : '/clinician')
  }

  return (
    <div className="flex min-h-svh flex-col bg-navy-950">
      <header className="flex h-20 items-center px-6 sm:px-10">
        <Logo tone="dark" />
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-10 px-6 pb-16 sm:px-10">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_220px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wide text-mist-300 uppercase">
              Movement, measured
            </p>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Guided rehab and mobility insight, in one place.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-mist-300">
              Patients follow an animated movement guide and record their exercises.
              Clinicians see range, symmetry, and recovery trends — not guesswork.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto hidden h-56 w-52 rounded-3xl bg-white/6 p-3 ring-1 ring-white/10 md:block"
          >
            <SkeletonGuide poseId="squat" tone="dark" label="Axia movement guide demonstrating a squat" />
          </motion.div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <motion.button
            type="button"
            onClick={() => choose('patient')}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="group cursor-pointer rounded-3xl bg-white p-6 text-left shadow-card-lg transition-transform hover:-translate-y-0.5"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-mist-100 text-navy-700">
              <HeartPulse className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-xl font-bold text-ink-900">I’m a patient</h2>
            <p className="mt-1 text-sm text-ink-400">
              Follow your plan, record sessions, and see your recovery progress.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-navy-700">
              Continue as Maya Torres
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => choose('clinician')}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="group cursor-pointer rounded-3xl bg-navy-800 p-6 text-left ring-1 ring-white/10 transition-transform hover:-translate-y-0.5"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-mist-300">
              <Stethoscope className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-xl font-bold text-white">I’m a clinician</h2>
            <p className="mt-1 text-sm text-mist-300">
              Review sessions, track mobility trends, and manage exercise plans.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-mist-200">
              Continue as Dr. Priya Raman
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </motion.button>
        </div>

        <p className="text-center text-xs text-mist-400">
          Demo build · all data is simulated · no real patient information
        </p>
      </main>
    </div>
  )
}
