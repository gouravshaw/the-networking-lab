'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Question, Option } from '@/types/quiz'
import { MultiSelectOption } from './MultiSelectOption'

type QuestionCardProps = {
  question: Question
  value: string[]
  onChange: (value: string[]) => void
  onNext: () => void
  onPrevious?: () => void
  showPrevious: boolean
}

export function QuestionCard({
  question,
  value,
  onChange,
  onNext,
  onPrevious,
  showPrevious,
}: QuestionCardProps) {
  const selectedIds = value

  const handleToggle = (option: Option) => {
    if (question.multi) {
      const next = selectedIds.includes(option.id)
        ? selectedIds.filter((id) => id !== option.id)
        : [...selectedIds, option.id]
      onChange(next)
    } else {
      onChange([option.id])
      if (question.autoAdvance !== false) {
        onNext()
      }
    }
  }

  const handleNext = () => {
    if (selectedIds.length > 0) {
      onNext()
    }
  }

  const canProceed = selectedIds.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="rounded-2xl shadow-xl shadow-gray-300/40 border-2 border-gray-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-charcoal mb-6 leading-snug tracking-tight">
          {question.question}
        </h2>

        <div className="space-y-2.5">
          {question.options.map((option) => (
            <MultiSelectOption
              key={option.id}
              option={option}
              selected={selectedIds.includes(option.id)}
              onToggle={() => handleToggle(option)}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between w-full">
          <div className="flex-1 flex justify-start">
            <button
              onClick={showPrevious && onPrevious ? onPrevious : undefined}
              type="button"
              aria-label="Previous question"
              disabled={!showPrevious || !onPrevious}
              className={`w-11 h-11 rounded-full p-[2px] transition-all group/prev flex items-center justify-center ${
                showPrevious && onPrevious
                  ? 'gradient-bg hover:opacity-90 cursor-pointer'
                  : 'bg-gray-200 cursor-not-allowed opacity-60'
              }`}
            >
              <span className={`w-full h-full min-w-0 min-h-0 rounded-full flex items-center justify-center transition-colors ${
                showPrevious && onPrevious
                  ? 'bg-white text-gray-600 group-hover/prev:text-accent'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </span>
            </button>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={canProceed ? handleNext : undefined}
              type="button"
              aria-label="Next question"
              disabled={!canProceed}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                canProceed
                  ? 'gradient-bg text-white hover:opacity-90 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
