import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts'

interface SparklineProps {
  values: number[]
  /** Whether the most recent movement is an improvement (colors the line). */
  improving?: boolean
  width?: number
  height?: number
}

/**
 * Tiny inline trend for list rows. Decorative reinforcement only — the
 * adjacent text always carries the actual value, so no axes or tooltip.
 */
export function Sparkline({ values, improving = true, width = 96, height = 32 }: SparklineProps) {
  const data = values.map((v, i) => ({ i, v }))
  return (
    <div style={{ width, height }} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
          <Line
            type="monotone"
            dataKey="v"
            stroke={improving ? 'var(--color-chart-1)' : 'var(--color-alert-600)'}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
