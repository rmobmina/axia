import { AlertTriangle, CheckCircle2, Circle, CircleDot, Info, OctagonAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { AlertSeverity, PlanItemStatus, RiskLevel } from '@/types'

/** Status colors always ship with an icon + text label — never color alone. */

export function PlanItemStatusBadge({ status }: { status: PlanItemStatus }) {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="good">
          <CheckCircle2 aria-hidden="true" /> Done
        </Badge>
      )
    case 'in-progress':
      return (
        <Badge variant="accent">
          <CircleDot aria-hidden="true" /> In progress
        </Badge>
      )
    default:
      return (
        <Badge variant="outline">
          <Circle aria-hidden="true" /> To do
        </Badge>
      )
  }
}

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  switch (severity) {
    case 'serious':
      return (
        <Badge variant="alert">
          <OctagonAlert aria-hidden="true" /> Serious
        </Badge>
      )
    case 'warning':
      return (
        <Badge variant="warn">
          <AlertTriangle aria-hidden="true" /> Watch
        </Badge>
      )
    default:
      return (
        <Badge variant="accent">
          <Info aria-hidden="true" /> Info
        </Badge>
      )
  }
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  switch (level) {
    case 'high':
      return (
        <Badge variant="alert">
          <OctagonAlert aria-hidden="true" /> High risk
        </Badge>
      )
    case 'moderate':
      return (
        <Badge variant="warn">
          <AlertTriangle aria-hidden="true" /> Moderate
        </Badge>
      )
    default:
      return (
        <Badge variant="good">
          <CheckCircle2 aria-hidden="true" /> Low risk
        </Badge>
      )
  }
}
