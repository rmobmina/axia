import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { RoleProvider, useRole } from '@/context/RoleContext'
import { PatientLayout } from '@/layouts/PatientLayout'
import { ClinicianLayout } from '@/layouts/ClinicianLayout'
import { RoleSelect } from '@/pages/RoleSelect'
import { PatientDashboard } from '@/pages/patient/PatientDashboard'
import { PlanPage } from '@/pages/patient/PlanPage'
import { ExerciseSessionPage } from '@/pages/patient/ExerciseSessionPage'
import { SessionSummaryPage } from '@/pages/patient/SessionSummaryPage'
import { AssessmentsHub } from '@/pages/patient/AssessmentsHub'
import { AssessmentRunPage } from '@/pages/patient/AssessmentRunPage'
import { AssessmentResultsPage } from '@/pages/patient/AssessmentResultsPage'
import { ProgressPage } from '@/pages/patient/ProgressPage'
import { ProfilePage } from '@/pages/patient/ProfilePage'
import { ClinicianDashboard } from '@/pages/clinician/ClinicianDashboard'
import { PatientsListPage } from '@/pages/clinician/PatientsListPage'
import { PatientDetailPage } from '@/pages/clinician/PatientDetailPage'
import { AssignPlanPage } from '@/pages/clinician/AssignPlanPage'
import { ReviewsPage } from '@/pages/clinician/ReviewsPage'
import { SessionReviewPage } from '@/pages/clinician/SessionReviewPage'
import { ClinicianSettingsPage } from '@/pages/clinician/ClinicianSettingsPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

function HomeRedirect() {
  const { role } = useRole()
  if (role === 'patient') return <Navigate to="/patient" replace />
  if (role === 'clinician') return <Navigate to="/clinician" replace />
  return <RoleSelect />
}

export default function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          {/* Patient portal */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<PatientDashboard />} />
            <Route path="plan" element={<PlanPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="assessments" element={<AssessmentsHub />} />
            <Route path="assessments/:type/results/:resultId" element={<AssessmentResultsPage />} />
          </Route>

          {/* Full-screen patient flows (no chrome — focus mode) */}
          <Route path="/patient/exercise/:exerciseId" element={<ExerciseSessionPage />} />
          <Route path="/patient/exercise/:exerciseId/summary" element={<SessionSummaryPage />} />
          <Route path="/patient/assessments/:type/run" element={<AssessmentRunPage />} />

          {/* Clinician dashboard */}
          <Route path="/clinician" element={<ClinicianLayout />}>
            <Route index element={<ClinicianDashboard />} />
            <Route path="patients" element={<PatientsListPage />} />
            <Route path="patients/:patientId" element={<PatientDetailPage />} />
            <Route path="patients/:patientId/assign" element={<AssignPlanPage />} />
            <Route path="plans" element={<Navigate to="/clinician/patients" replace />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="reviews/:sessionId" element={<SessionReviewPage />} />
            <Route path="settings" element={<ClinicianSettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </RoleProvider>
  )
}
