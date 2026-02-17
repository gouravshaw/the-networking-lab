'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const INTEREST_OPTIONS = [
  { value: 'not_interested', label: 'Not interested' },
  { value: 'curious', label: 'Curious' },
  { value: 'would_try', label: 'I would try it' },
  { value: 'want_this', label: 'I want this' },
]

const FEEDBACK_OPTIONS = [
  { id: 'chatgpt', label: 'I can get this from ChatGPT' },
  { id: 'dont_network', label: "I don't network enough" },
  { id: 'no_value', label: "I don't see the value" },
  { id: 'too_generic', label: 'Too generic' },
  { id: 'other', label: 'Other' },
]

type ValidationModalProps = {
  isOpen: boolean
  onSelect: (interestLevel: string, feedbackReasons?: string[], feedbackOther?: string) => void
  onClose: () => void
}

export function ValidationModal({ isOpen, onSelect, onClose }: ValidationModalProps) {
  const [interestLevel, setInterestLevel] = useState<string | null>(null)
  const [feedbackReasons, setFeedbackReasons] = useState<string[]>([])
  const [feedbackOther, setFeedbackOther] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  const handleInterestSelect = (value: string) => {
    if (value === 'not_interested') {
      setInterestLevel(value)
      setShowFeedback(true)
    } else {
      onSelect(value)
    }
  }

  const handleFeedbackToggle = (id: string) => {
    setFeedbackReasons((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  const handleFeedbackSubmit = () => {
    if (interestLevel) {
      onSelect(interestLevel, feedbackReasons, feedbackOther.trim() || undefined)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md rounded-2xl shadow-2xl border-2 border-gray-200 bg-white p-8 sm:p-10"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {!showFeedback ? (
            <>
              <h3 className="text-lg font-bold text-charcoal mb-2 pr-10">
                If this system actively trained you based on your networking
                pattern, would you use it?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Your answer helps us improve. Please select one.
              </p>
              <div className="space-y-2">
                {INTEREST_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleInterestSelect(opt.value)}
                    className="w-full text-left px-4 py-3 rounded-xl border-2 border-gray-300 hover:border-accent hover:bg-accent/5 text-gray-800 font-medium transition-all"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-charcoal mb-2 pr-10">
                Thanks for your honesty. What holds you back?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select any that apply (optional).
              </p>
              <div className="space-y-2 mb-4">
                {FEEDBACK_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={feedbackReasons.includes(opt.id)}
                      onChange={() => handleFeedbackToggle(opt.id)}
                      className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  value={feedbackOther}
                  onChange={(e) => setFeedbackOther(e.target.value)}
                  placeholder="Other (optional)"
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleFeedbackSubmit}
                className="w-full py-3.5 px-6 rounded-xl font-semibold gradient-bg text-white hover:opacity-95 transition-all"
              >
                Submit feedback
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
