'use client'

import { motion } from 'framer-motion'

type ProgressBarProps = {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = Math.min((currentStep / totalSteps) * 100, 100)

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-gray-100/80 z-50">
      <motion.div
        className="h-full gradient-bg"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  )
}
