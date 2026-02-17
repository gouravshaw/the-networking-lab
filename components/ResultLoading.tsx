'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOADING_MESSAGES = [
  'Analyzing your networking patterns…',
  'Building your persona profile…',
  'Almost there…',
]

const MESSAGE_INTERVAL_MS = 1200
const TOTAL_DURATION_MS = 5000

type ResultLoadingProps = {
  onComplete: () => void
}

export function ResultLoading({ onComplete }: ResultLoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, MESSAGE_INTERVAL_MS)
    return () => clearInterval(messageTimer)
  }, [])

  useEffect(() => {
    const doneTimer = setTimeout(onComplete, TOTAL_DURATION_MS)
    return () => clearTimeout(doneTimer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto text-center"
    >
      <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-xl shadow-gray-300/40 p-12 sm:p-16">
        <div className="flex justify-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-accent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-medium text-charcoal"
          >
            {LOADING_MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
