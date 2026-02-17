import type { QuizSessionRecord } from './data'

export type QuizProgressPayload = Partial<
  Omit<QuizSessionRecord, 'sessionId' | 'started_at'>
>

export async function saveQuizProgress(
  sessionId: string,
  payload: QuizProgressPayload
): Promise<void> {
  try {
    const res = await fetch('/api/quiz-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, ...payload }),
    })
    if (!res.ok) throw new Error('Failed to save progress')
  } catch (err) {
    console.error('Progress save error:', err)
  }
}

export type SubmissionData = {
  stage: string
  main_goal: string
  persona: string
  persona_score: number
  event_frequency: string
  improvement_goal: string
  open_text: string
  interest_level: string
  email: string
  created_at: string
}

export type InterestData = {
  interest_level: string
  persona: string
  created_at: string
  feedback_reasons?: string[]
  feedback_other?: string
}

export async function saveValidation(data: InterestData): Promise<void> {
  try {
    const res = await fetch('/api/interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, created_at: data.created_at || new Date().toISOString() }),
    })
    if (!res.ok) throw new Error('Failed to save validation')
  } catch (err) {
    console.error('Validation save error:', err)
  }
}

export async function saveSubmission(data: SubmissionData): Promise<void> {
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      throw new Error('Failed to save submission')
    }
  } catch (err) {
    console.error('Storage error:', err)
    throw err
  }
}

export async function saveInterest(data: InterestData): Promise<void> {
  try {
    const res = await fetch('/api/interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      throw new Error('Failed to save interest')
    }
  } catch (err) {
    console.error('Interest save error:', err)
    throw err
  }
}
