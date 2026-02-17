'use client'

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
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
    value: Math.max(0, value + 10),
    fullMark: 20,
  }))

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="trait"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 20]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar
            name="Your profile"
            dataKey="value"
            stroke="#8C52FF"
            fill="#8C52FF"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
