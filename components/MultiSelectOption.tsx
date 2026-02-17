'use client'

import { motion } from 'framer-motion'
import type { Option } from '@/types/quiz'

type MultiSelectOptionProps = {
  option: Option
  selected: boolean
  onToggle: () => void
}

export function MultiSelectOption({
  option,
  selected,
  onToggle,
}: MultiSelectOptionProps) {
  return (
    <motion.div
      className={`rounded-xl p-[2px] transition-all cursor-pointer ${
        selected
          ? 'gradient-bg'
          : 'bg-gray-300 hover:bg-gradient-to-r hover:from-accent hover:to-accent-cyan'
      }`}
      whileTap={{ scale: 0.995 }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 py-3.5 rounded-[10px] bg-white text-charcoal font-medium"
      >
        {option.label}
      </button>
    </motion.div>
  )
}
