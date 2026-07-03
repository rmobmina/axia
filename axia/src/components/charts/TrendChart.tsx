import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatDate } from '@/lib/utils'

/**
 * Generic time-trend line chart.
 * Dataviz rules applied: 2px lines, ≥8px markers, recessive grid, one y-axis,
 * text in ink tokens, legend rendered by the parent when ≥2 series.
 */

export interface TrendSeries {
  key: string
  label: string
  /** One of the validated chart tokens. */
  color: string
}

interface TrendChartProps {
  data: object[]
  xKey: string
  series: TrendSeries[]
  unit?: string
  height?: number
  yDomain?: [number | 'auto', number | 'auto']
  /** Format x values as dates (default true — most Axia trends are by date). */
  xIsDate?: boolean
}

const AXIS_STYLE = {
  fontSize: 12,
  fill: 'var(--color-ink-400)',
  fontWeight: 600,
} as const

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: '1px solid var(--color-mist-200)',
  boxShadow: 'var(--shadow-card)',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-ink-900)',
  padding: '8px 12px',
} as const

export function TrendChart({
  data,
  xKey,
  series,
  unit,
  height = 240,
  yDomain,
  xIsDate = true,
}: TrendChartProps) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <CartesianGrid stroke="var(--color-mist-100)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={AXIS_STYLE}
            tickFormatter={xIsDate ? (v: string) => formatDate(v) : undefined}
            axisLine={{ stroke: 'var(--color-mist-200)' }}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            domain={yDomain ?? ['auto', 'auto']}
            unit={unit}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelFormatter={xIsDate ? (v) => formatDate(String(v)) : undefined}
            formatter={(value: unknown, name: unknown) => [
              `${value}${unit ?? ''}`,
              series.find((s) => s.key === name)?.label ?? String(name),
            ]}
            cursor={{ stroke: 'var(--color-mist-300)', strokeWidth: 1 }}
          />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 4, fill: s.color, strokeWidth: 2, stroke: 'white' }}
              activeDot={{ r: 5.5, strokeWidth: 2, stroke: 'white' }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/** Inline legend used above/below charts when ≥2 series are shown. */
export function ChartLegend({ series }: { series: TrendSeries[] }) {
  if (series.length < 2) return null
  return (
    <div className="flex flex-wrap items-center gap-4">
      {series.map((s) => (
        <span key={s.key} className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600">
          <span
            aria-hidden="true"
            className="inline-block size-2.5 rounded-full"
            style={{ background: s.color }}
          />
          {s.label}
        </span>
      ))}
    </div>
  )
}
