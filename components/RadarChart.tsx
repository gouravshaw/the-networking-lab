'use client'

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import type { TraitScores } from '@/lib/scoring'

const TRAIT_LABELS: Record<string, string> = {
  confidence: 'Confidence',
  conversation: 'Conversation',
  positioning: 'Positioning',
  followUp: 'Follow-up',
  leverage: 'Leverage',
}

type RadarChartProps = {
  traitScores: TraitScores
}

export function RadarChart({ traitScores }: RadarChartProps) {
  const data = Object.entries(traitScores).map(([trait, value]) => ({
    trait: TRAIT_LABELS[trait] ?? trait,
    value: Math.max(0, value),
    fullMark: 20,
  }))

  // Custom tick that shows "Label (score/20)"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderAxisTick = (props: any) => {
    const { payload, x, y, textAnchor } = props
    const entry = data.find((d) => d.trait === payload.value)
    const score = entry ? entry.value : 0
    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor as 'start' | 'middle' | 'end'}
        fill="#374151"
        fontSize={13}
        fontWeight={600}
      >
        <tspan>{payload.value}</tspan>
        <tspan fill="#8C52FF" fontWeight={700}>{` ${score}/20`}</tspan>
      </text>
    )
  }

  return (
    <div className="w-full h-64 -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} cx="48%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="trait"
            tick={renderAxisTick}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 20]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Your profile"
            dataKey="value"
            stroke="#8C52FF"
            fill="#8C52FF"
            fillOpacity={0.25}
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#8C52FF', stroke: '#fff', strokeWidth: 2 }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
