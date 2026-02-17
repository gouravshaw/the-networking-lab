'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from './Button'
import { config } from '@/lib/config'

function ThankYouScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = config.websiteUrl
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xl mx-auto text-center"
    >
      <div className="rounded-2xl shadow-xl shadow-gray-300/40 border-2 border-gray-200 p-8 sm:p-10 bg-white space-y-6">
        <h2 className="text-2xl font-extrabold text-charcoal">Thank you!</h2>
        <p className="text-gray-600 text-[15px] leading-relaxed max-w-sm mx-auto">
          Your personalised breakdown will arrive in your inbox soon.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to our website in 3 seconds…
        </p>
        <a
          href={config.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full py-3.5 px-6 rounded-xl font-semibold gradient-bg text-white hover:opacity-95 shadow-lg shadow-purple-500/25 transition-all text-[15px]"
        >
          Visit our website →
        </a>
      </div>
    </motion.div>
  )
}

type EmailGateProps = {
  onSubmit: (data: { email: string; consentBreakdown: boolean }) => Promise<void>
}

export function EmailGate({ onSubmit }: EmailGateProps) {
  const [email, setEmail] = useState('')
  const [consentBreakdown, setConsentBreakdown] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValid = email.trim() && consentBreakdown

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return

    setLoading(true)
    setError('')

    try {
      await onSubmit({
        email: email.trim(),
        consentBreakdown,
      })
      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <ThankYouScreen />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-xl mx-auto"
    >
      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl shadow-xl shadow-gray-300/40 border-2 border-gray-200 p-6 sm:p-8 bg-white space-y-6">
          <h2 className="text-xl font-bold text-charcoal">
            Get your full networking breakdown + a personalised superpower hack
          </h2>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentBreakdown}
                onChange={(e) => setConsentBreakdown(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span className="text-sm text-gray-700">
                I agree to receive my personalised breakdown by email{' '}
                <span className="text-red-500">*</span>
              </span>
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={!isValid || loading}>
            {loading ? (
              'Sending...'
            ) : (
              <>
                Send me my full report
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
