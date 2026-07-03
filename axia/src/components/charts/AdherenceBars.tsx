import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatDate } from '@/lib/utils'

interface AdherenceBarsProps {
  data: { weekOf: string; adherencePct: number }[]
  height?: number
}

/** Weekly adherence bars — 4px rounded data-ends, baseline-anchored. */
export function AdherenceBars({ data, height = 220 }: AdherenceBarsProps) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }} barCategoryGap="28%">
          <CartesianGrid stroke="var(--color-mist-100)" vertical={false} />
          <XAxis
            dataKey="weekOf"
            tick={{ fontSize: 12, fill: 'var(--color-ink-400)', fontWeight: 600 }}
            tickFormatter={(v: string) => formatDate(v)}
            axisLine={{ stroke: 'var(--color-mist-200)' }}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'var(--color-ink-400)', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip
            cursor={{ fill: 'var(--color-mist-50)' }}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid var(--color-mist-200)',
              boxShadow: 'var(--shadow-card)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-ink-900)',
              padding: '8px 12px',
            }}
            labelFormatter={(v) => `Week of ${formatDate(String(v))}`}
            formatter={(value: unknown) => [`${value}%`, 'Adherence']}
          />
          <Bar dataKey="adherencePct" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
