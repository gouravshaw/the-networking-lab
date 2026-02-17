'use client'

import { motion } from 'framer-motion'

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles =
    'w-full py-3.5 px-6 rounded-xl font-semibold transition-all min-h-[48px] flex items-center justify-center text-[15px] gap-2'
  const primaryStyles =
    'gradient-bg text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg'
  const secondaryStyles =
    'bg-white/80 border-2 border-gray-200/80 text-charcoal hover:border-accent/50 hover:bg-white'

  const styles =
    variant === 'primary'
      ? `${baseStyles} ${primaryStyles}`
      : `${baseStyles} ${secondaryStyles}`

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles} ${className}`}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  )
}
