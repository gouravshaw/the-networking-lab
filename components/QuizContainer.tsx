'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { questions } from '@/data/questions'
import { personas } from '@/data/personas'
import { calculateResults } from '@/lib/scoring'
import { createSessionId } from '@/lib/session'
import { saveQuizProgress, saveSubmission, saveValidation } from '@/lib/storage'
import { ProgressBar } from './ProgressBar'
import { QuestionCard } from './QuestionCard'
import { ResultScreen } from './ResultScreen'
import { ValidationModal } from './ValidationModal'
import { EmailGate } from './EmailGate'
import { QuizHeader } from './QuizHeader'
import { ResultLoading } from './ResultLoading'

const INTRO_STEP = 0
const QUESTION_START = 1
const RESULT_STEP = 8
const EMAIL_STEP = 9
const TOTAL_STEPS = 10

export function QuizContainer() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(INTRO_STEP)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [interestLevel, setInterestLevel] = useState('')
  const [validationModalOpen, setValidationModalOpen] = useState(false)
  const [feedbackReasons, setFeedbackReasons] = useState<string[]>([])
  const [feedbackOther, setFeedbackOther] = useState('')
  const [stageOtherText, setStageOtherText] = useState('')
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [isLoadingResult, setIsLoadingResult] = useState(false)

  // Hydrate state from sessionStorage on mount
  useEffect(() => {
    const savedStep = sessionStorage.getItem('quiz_currentStep')
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10))
    }

    const savedAnswers = sessionStorage.getItem('quiz_answers')
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }
  }, [])

  useEffect(() => {
    setSessionId(createSessionId())
  }, [])

  // Persist answers and currentStep to sessionStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      sessionStorage.setItem('quiz_answers', JSON.stringify(answers))
    }
  }, [answers])

  useEffect(() => {
    sessionStorage.setItem('quiz_currentStep', String(currentStep))
  }, [currentStep])

  const results = calculateResults(answers)
  let persona = personas[results.dominantPersona]

  if (results.isOptimizer) {
    persona = {
      ...persona,
      title: 'Low Friction Profile (Optimizer)',
      tagline: 'You have a healthy approach, but you want to do more.',
      pattern:
        'This is what happens in real life: You don’t feel paralyzed by anxiety or friction. You attend events, you talk to people, and you generally feel fine. But you know you could be getting more out of the time you invest.',
      risk:
        'Without a system, you might coast. You’re doing "fine", but you’re leaving opportunity on the table because you aren’t being strategic enough.',
      solution:
        'This is fixable with simple workflows. The Networking Lab helps you move from "attending" to "leveraging". We give you the strategic frameworks to turn casual conversations into tangible career assets.',
    }
  }

  const saveProgress = useCallback(
    (payload: Parameters<typeof saveQuizProgress>[1]) => {
      if (sessionId) saveQuizProgress(sessionId, payload)
    },
    [sessionId]
  )

  const handleAnswer = (questionId: string, value: string[]) => {
    const nextAnswers = { ...answers, [questionId]: value }
    setAnswers(nextAnswers)
    saveProgress({ answers: nextAnswers, current_step: currentStep })
  }

  const handleNext = () => {
    const nextStep = currentStep + 1
    saveProgress({ answers, current_step: nextStep })
    if (nextStep === RESULT_STEP) {
      setIsLoadingResult(true)
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1))
    }
  }

  const handleLoadingComplete = useCallback(() => {
    setIsLoadingResult(false)
    setCurrentStep(RESULT_STEP)
  }, [])

  const handlePrevious = () => {
    const prevStep = Math.max(currentStep - 1, 0)
    setCurrentStep(prevStep)
    saveProgress({ answers, current_step: prevStep })
  }

  const handleReset = () => {
    sessionStorage.removeItem('quiz_answers')
    sessionStorage.removeItem('quiz_currentStep')
    setSessionId(createSessionId())
    setCurrentStep(INTRO_STEP)
    setAnswers({})
    setInterestLevel('')
    setValidationModalOpen(false)
    setShowEmailGate(false)
    setFeedbackReasons([])
    setFeedbackOther('')
    setStageOtherText('')
    setIsLoadingResult(false)
  }

  const openValidationModal = useCallback(() => {
    setValidationModalOpen(true)
  }, [])

  const handleValidationSelect = (
    level: string,
    reasons?: string[],
    other?: string
  ) => {
    setInterestLevel(level)
    setValidationModalOpen(false)

    saveProgress({
      answers,
      current_step: currentStep,
      interest_level: level,
      feedback_reasons: reasons,
      feedback_other: other,
      persona: results.dominantPersona,
    })

    saveValidation({
      interest_level: level,
      persona: results.dominantPersona,
      created_at: new Date().toISOString(),
      feedback_reasons: reasons,
      feedback_other: other,
    }).catch(() => { })

    if (level !== 'not_interested') {
      setShowEmailGate(true)
      setCurrentStep(EMAIL_STEP)
    }
  }

  const handleEmailSubmit = async (data: {
    email: string
    consentBreakdown: boolean
  }) => {
    saveProgress({
      answers,
      current_step: EMAIL_STEP,
      interest_level: interestLevel,
      feedback_reasons: feedbackReasons,
      feedback_other: feedbackOther,
      persona: results.dominantPersona,
      email: data.email,
      consent: data.consentBreakdown,
      completed: true,
    })

    await saveSubmission({
      stage: answers.stage?.map(s => s === 'other' ? `Other: ${stageOtherText}` : s).join(',') ?? '',
      main_goal: answers.main_goal?.join(',') ?? '',
      persona: results.dominantPersona,
      persona_score: results.personaScores[results.dominantPersona],
      event_frequency: answers.event_frequency?.[0] ?? '',
      improvement_goal: answers.improvement_goal?.join(',') ?? '',
      open_text: feedbackOther,
      interest_level: interestLevel,
      email: data.email,
      created_at: new Date().toISOString(),
    })
  }

  if (currentStep === INTRO_STEP) {
    return (
      <>
        <ProgressBar currentStep={0} totalSteps={TOTAL_STEPS} />
        <QuizHeader onLogoClick={handleReset} />
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative min-h-screen flex flex-col pt-24 pb-32 px-4 sm:px-6"
        >
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="w-full max-w-4xl mx-auto">
              <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-xl shadow-gray-300/40 px-8 py-14 sm:px-12 sm:py-16 md:px-16 md:py-20">
                <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-16 items-start">
                  <div className="flex flex-col gap-8 md:gap-10">
                    <h1 className="text-3xl sm:text-4xl md:text-[2.25rem] font-bold text-charcoal tracking-tight leading-tight">
                      Discover Your Networking Persona
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                      Understand how you naturally show up when you network and where momentum breaks.
                    </p>
                    <p className="text-sm text-gray-500">
                      5 personas · 7 questions · Instant profile preview · ~2 min
                    </p>
                  </div>

                  <div className="flex flex-col gap-8">
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50/80 p-3 md:p-4">
                      <Image
                        src="/images/all_personas.png"
                        alt="The 5 Networking Personas"
                        width={560}
                        height={210}
                        className="w-full h-auto object-contain"
                        priority
                      />
                    </div>
                    <motion.button
                      type="button"
                      onClick={handleNext}
                      className="w-full px-8 py-4 rounded-full font-semibold gradient-bg text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all text-[16px] inline-flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Start Assessment
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.main>
      </>
    )
  }

  if (isLoadingResult) {
    return (
      <>
        <ProgressBar currentStep={8} totalSteps={TOTAL_STEPS} />
        <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-12">
          <QuizHeader onLogoClick={handleReset} />
          <AnimatePresence mode="wait">
            <ResultLoading key="loading" onComplete={handleLoadingComplete} />
          </AnimatePresence>
        </div>
      </>
    )
  }

  if (currentStep === RESULT_STEP) {
    return (
      <>
        <ProgressBar currentStep={RESULT_STEP} totalSteps={TOTAL_STEPS} />
        <ValidationModal
          isOpen={validationModalOpen}
          onSelect={handleValidationSelect}
          onClose={() => setValidationModalOpen(false)}
        />
        <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-12">
          <QuizHeader onLogoClick={handleReset} />
          <AnimatePresence mode="wait">
            <ResultScreen
              key="result"
              persona={persona}
              traitScores={results.traitScores}
              onGetFullReport={openValidationModal}
            />
          </AnimatePresence>
        </div>
      </>
    )
  }

  if (currentStep === EMAIL_STEP && showEmailGate) {
    return (
      <>
        <ProgressBar currentStep={EMAIL_STEP} totalSteps={TOTAL_STEPS} />
        <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-12">
          <QuizHeader onLogoClick={handleReset} />
          <AnimatePresence mode="wait">
            <EmailGate key="email" onSubmit={handleEmailSubmit} />
          </AnimatePresence>
        </div>
      </>
    )
  }

  const questionIndex = currentStep - QUESTION_START
  const question = questions[questionIndex]

  return (
    <>
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-12">
        <QuizHeader onLogoClick={handleReset} />
        <p className="mb-4 text-sm font-bold text-gray-500">
          Question {currentStep} of 7
        </p>
        <AnimatePresence mode="wait">
          <QuestionCard
            key={question.id}
            question={question}
            value={answers[question.id] ?? []}
            onChange={(value) => handleAnswer(question.id, value)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            showPrevious={questionIndex > 0}
            otherValue={stageOtherText}
            onOtherChange={setStageOtherText}
          />
        </AnimatePresence>
      </div>
    </>
  )
}
