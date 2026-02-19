'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Persona } from '@/data/personas'
import { PERSONA_CIRCLE_COLORS } from '@/data/personas'
import type { TraitScores } from '@/lib/scoring'
import { RadarChart } from './RadarChart'

type ResultScreenProps = {
  persona: Persona
  traitScores: TraitScores
  onGetFullReport: () => void
}

const TRAIT_LABELS: Record<string, string> = {
  confidence: 'Confidence',
  conversation: 'Conversation',
  positioning: 'Positioning',
  followUp: 'Follow-up',
  leverage: 'Leverage',
}

function getTopAndBottomTraits(traitScores: TraitScores) {
  const entries = Object.entries(traitScores)
    .map(([key, value]) => ({ key, label: TRAIT_LABELS[key] ?? key, value }))
    .sort((a, b) => b.value - a.value)

  return {
    strongest: entries[0],
    weakest: entries[entries.length - 1],
  }
}

export function ResultScreen({
  persona,
  traitScores,
  onGetFullReport,
}: ResultScreenProps) {
  const { strongest, weakest } = getTopAndBottomTraits(traitScores)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="rounded-2xl shadow-xl shadow-gray-300/40 border-2 border-gray-200 overflow-hidden bg-white">
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Persona Info & Content */}
          <div className="space-y-3">
            <div>
              <div className="flex gap-4 items-center">
                <div
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 ring-2 ring-white shadow-lg ${PERSONA_CIRCLE_COLORS[persona.circleColor].bg} ${PERSONA_CIRCLE_COLORS[persona.circleColor].border} ${PERSONA_CIRCLE_COLORS[persona.circleColor].ring}`}
                >
                  <Image
                    src={persona.imagePath}
                    alt={persona.title}
                    width={112}
                    height={112}
                    className="w-full h-full object-contain p-2"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal mb-1 tracking-tight">
                    {persona.title}
                  </h2>
                  <p className="text-accent font-semibold text-sm">
                    {persona.tagline}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 leading-snug text-[13px] mt-3">
                {persona.pattern}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50/80 border-2 border-amber-200/80 p-3">
              <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider mb-2">
                If this continues…
              </p>
              <p className="text-gray-700 text-[13px] leading-snug">
                {persona.risk}
              </p>
            </div>

            {/* Quick Snapshot: fills the gap below risk */}
            <div className="rounded-xl bg-purple-50/60 border border-purple-200/80 p-3">
              <p className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider mb-2">
                Quick snapshot
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 border border-green-300 flex items-center justify-center mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                  </span>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">Strongest area:</span>{' '}
                    {strongest.label} ({strongest.value}/20)
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01" /></svg>
                  </span>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">Biggest opportunity:</span>{' '}
                    {weakest.label} ({weakest.value}/20)
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">Focus tip:</span>{' '}
                    Small improvements in {weakest.label.toLowerCase()} will have the biggest impact on your results.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Chart & Action */}
          <div className="space-y-3 flex flex-col h-full">
            <div>
              <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Your networking profile
              </p>
              <RadarChart traitScores={traitScores} />
              <div className="mt-2 space-y-1 text-[11px] text-gray-600 bg-gray-50/50 rounded-lg p-2.5 border border-gray-100">
                <p><span className="font-bold text-gray-800">Confidence:</span> How comfortable you feel entering a room and initiating contact.</p>
                <p><span className="font-bold text-gray-800">Conversation:</span> Your ability to start, hold, and steer conversations naturally.</p>
                <p><span className="font-bold text-gray-800">Positioning:</span> How clearly people understand what you do and the value you bring.</p>
                <p><span className="font-bold text-gray-800">Follow-up:</span> How consistently you stay in touch and nurture connections over time.</p>
                <p><span className="font-bold text-gray-800">Leverage:</span> How effectively you turn relationships into real opportunities.</p>
              </div>
            </div>

            {/* Enhanced CTA Section */}
            <div className="rounded-xl overflow-hidden mt-auto shadow-md">
              <div className="gradient-bg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                  <p className="text-sm font-bold text-white uppercase tracking-wider">
                    The Networking Lab
                  </p>
                </div>
                <p className="text-white/90 text-[13px] leading-snug mb-3">
                  {persona.solution}
                </p>
                <motion.button
                  type="button"
                  onClick={onGetFullReport}
                  className="w-full py-2.5 px-5 rounded-xl font-semibold bg-white text-purple-700 hover:bg-purple-50 shadow-lg transition-all text-sm inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Get your full report
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
