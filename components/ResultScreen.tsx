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

export function ResultScreen({
  persona,
  traitScores,
  onGetFullReport,
}: ResultScreenProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="rounded-2xl shadow-xl shadow-gray-300/40 border-2 border-gray-200 overflow-hidden bg-white">
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex gap-4 sm:gap-5 items-center">
              <div
                className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 ring-2 ring-white shadow-md ${PERSONA_CIRCLE_COLORS[persona.circleColor].bg} ${PERSONA_CIRCLE_COLORS[persona.circleColor].border} ${PERSONA_CIRCLE_COLORS[persona.circleColor].ring}`}
              >
                <Image
                  src={persona.imagePath}
                  alt={persona.title}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover object-center scale-125"
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
            <p className="text-gray-600 leading-relaxed text-[15px] mt-4">
              {persona.pattern}
            </p>
          </div>

          <div className="rounded-xl bg-amber-50/80 border-2 border-amber-200/80 p-4">
            <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider mb-2">
              If this continues…
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              {persona.risk}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Your networking profile
            </p>
            <RadarChart traitScores={traitScores} />
          </div>

          <div className="rounded-xl bg-gray-50 p-4 border-2 border-gray-200">
            <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">
              This is where The Networking Lab comes in
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              {persona.solution}
            </p>
          </div>

          <motion.button
            type="button"
            onClick={onGetFullReport}
            className="w-full py-3.5 px-6 rounded-xl font-semibold gradient-bg text-white hover:opacity-95 shadow-lg shadow-purple-500/25 transition-all text-[15px] inline-flex items-center justify-center gap-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Get full report
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
