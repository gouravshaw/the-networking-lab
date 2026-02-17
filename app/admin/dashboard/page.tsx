import { getSubmissions, getQuizSessions, getInterestRecords } from '@/lib/data'
import { personas } from '@/data/personas'
import { questions } from '@/data/questions'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { DashboardContent, type SubmissionRecord, type InterestRecord } from '@/components/admin/DashboardContent'
import type { QuizSessionRecord } from '@/lib/data'

const PERSONA_COLOR_HEX: Record<string, string> = {
  blue: '#60a5fa',
  purple: '#a78bfa',
  orange: '#fb923c',
  green: '#4ade80',
  yellow: '#facc15',
  teal: '#2dd4bf',
  indigo: '#818cf8',
}

function personaTitlesMap(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(personas).map(([key, p]) => [key, p.title])
  )
}

function personaColorsMap(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(personas).map(([key, p]) => [key, PERSONA_COLOR_HEX[p.circleColor] ?? '#8c52ff'])
  )
}

function getQuestionOptions(questionId: string): { id: string; label: string }[] {
  const q = questions.find((x) => x.id === questionId)
  return q ? q.options.map((o) => ({ id: o.id, label: o.label })) : []
}

const INTEREST_OPTIONS = [
  { id: 'not_interested', label: 'Not interested' },
  { id: 'curious', label: 'Curious' },
  { id: 'would_try', label: 'I would try it' },
  { id: 'want_this', label: 'I want this' },
]

export default async function DashboardPage() {
  const [submissions, sessions, interest] = await Promise.all([
    getSubmissions(),
    getQuizSessions(),
    getInterestRecords(),
  ])

  const submissionList = (Array.isArray(submissions) ? submissions : []) as SubmissionRecord[]
  const sessionList = (Array.isArray(sessions) ? sessions : []) as QuizSessionRecord[]
  const interestList = (Array.isArray(interest) ? interest : []) as InterestRecord[]

  return (
    <>
      <AdminHeader />
      <DashboardContent
        submissions={submissionList}
        sessions={sessionList}
        interest={interestList}
        personaTitles={personaTitlesMap()}
        personaColors={personaColorsMap()}
        stageOptions={getQuestionOptions('stage')}
        eventFrequencyOptions={getQuestionOptions('event_frequency')}
        improvementGoalOptions={getQuestionOptions('improvement_goal')}
        interestLevelOptions={INTEREST_OPTIONS}
      />
    </>
  )
}
