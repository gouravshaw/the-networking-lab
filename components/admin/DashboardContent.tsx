'use client'

import { useMemo, useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import type { QuizSessionRecord } from '@/lib/data'

export type SubmissionRecord = {
  created_at?: string
  persona?: string
  stage?: string
  event_frequency?: string
  improvement_goal?: string
  interest_level?: string
  email?: string
  [key: string]: unknown
}

export type InterestRecord = {
  created_at?: string
  interest_level?: string
  persona?: string
  [key: string]: unknown
}

const CHART_COLORS = ['#8c52ff', '#06b6d4', '#a78bfa', '#67e8f9', '#c4b5fd', '#22d3ee', '#7c3aed']

export type TimeRange = '1h' | '24h' | '7d' | '30d' | 'all'

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '1h', label: 'Last hour' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'all', label: 'All time' },
]

function getRangeStart(range: TimeRange): number | null {
  if (range === 'all') return null
  const now = Date.now()
  const h = 60 * 60 * 1000
  const d = 24 * h
  switch (range) {
    case '1h': return now - 1 * h
    case '24h': return now - 24 * h
    case '7d': return now - 7 * d
    case '30d': return now - 30 * d
    default: return null
  }
}

function filterByDate<T>(
  items: T[],
  range: TimeRange,
  getDate: (item: T) => string | undefined
): T[] {
  const start = getRangeStart(range)
  if (start === null) return items
  return items.filter((item) => {
    const d = getDate(item)
    if (!d) return false
    return new Date(d).getTime() >= start
  })
}

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime()
  const diff = Date.now() - d
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  if (hours < 24) return `${hours} hr ago`
  if (days < 7) return `${days} days ago`
  return new Date(iso).toLocaleDateString()
}

function countBy<T>(items: T[], key: (item: T) => string): Record<string, number> {
  const out: Record<string, number> = {}
  for (const item of items) {
    const k = key(item)
    out[k] = (out[k] ?? 0) + 1
  }
  return out
}

type OptionItem = { id: string; label: string }

type DashboardContentProps = {
  submissions: SubmissionRecord[]
  sessions: QuizSessionRecord[]
  interest: InterestRecord[]
  personaTitles: Record<string, string>
  personaColors: Record<string, string>
  stageOptions: OptionItem[]
  eventFrequencyOptions: OptionItem[]
  improvementGoalOptions: OptionItem[]
  interestLevelOptions: OptionItem[]
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-2xl shadow-xl shadow-gray-300/40 border-2 border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-[var(--charcoal)] mt-1">{value}</p>
      {sub != null && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  )
}

const cardClass = 'rounded-2xl shadow-xl shadow-gray-300/40 border-2 border-gray-200 bg-white p-6'
const emptyCopy = 'Complete a quiz to see data here.'

function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

export function DashboardContent({
  submissions: rawSubmissions,
  sessions: rawSessions,
  interest: rawInterest,
  personaTitles,
  personaColors,
  stageOptions,
  eventFrequencyOptions,
  improvementGoalOptions,
  interestLevelOptions,
}: DashboardContentProps) {
  const [range, setRange] = useState<TimeRange>('all')
  const [exportMessage, setExportMessage] = useState<string | null>(null)
  const mounted = useMounted()

  const { submissions, sessions, interest } = useMemo(() => ({
    submissions: filterByDate(rawSubmissions, range, (s) => s.created_at),
    sessions: filterByDate(rawSessions, range, (s) => s.started_at),
    interest: filterByDate(rawInterest, range, (r) => r.created_at),
  }), [rawSubmissions, rawSessions, rawInterest, range])

  const lastActivity = useMemo(() => {
    const dates: number[] = []
    submissions.forEach((s) => { if (s.created_at) dates.push(new Date(s.created_at).getTime()) })
    sessions.forEach((s) => { if (s.updated_at) dates.push(new Date(s.updated_at).getTime()) })
    interest.forEach((r) => { if (r.created_at) dates.push(new Date(r.created_at).getTime()) })
    if (dates.length === 0) return null
    return new Date(Math.max(...dates)).toISOString()
  }, [submissions, sessions, interest])

  const personaCounts = useMemo(() => {
    const fromSub = countBy(
      submissions.filter((s) => s.persona),
      (s) => String(s.persona!)
    )
    const fromSess = countBy(
      sessions.filter((s) => s.persona),
      (s) => s.persona!
    )
    const combined: Record<string, number> = {}
    for (const [k, v] of Object.entries(fromSub)) combined[k] = (combined[k] ?? 0) + v
    for (const [k, v] of Object.entries(fromSess)) combined[k] = (combined[k] ?? 0) + v
    return Object.entries(personaTitles).map(([key, name]) => ({
      name,
      count: combined[key] ?? 0,
      personaKey: key,
    }))
  }, [submissions, sessions, personaTitles])

  const personaKeys = useMemo(() => Object.keys(personaTitles), [personaTitles])

  const interestData = useMemo(() => {
    const counts = countBy(
      interest.filter((r) => r.interest_level),
      (r) => String(r.interest_level!)
    )
    return interestLevelOptions.map((opt) => ({
      name: opt.label,
      count: counts[opt.id] ?? 0,
    }))
  }, [interest, interestLevelOptions])

  const interestDataStacked = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {}
    function add(level: string | undefined, persona: string | undefined) {
      if (!level || !persona) return
      if (!matrix[level]) matrix[level] = {}
      matrix[level][persona] = (matrix[level][persona] ?? 0) + 1
    }
    interest.forEach((r) => add(r.interest_level, r.persona))
    submissions.forEach((s) => add(s.interest_level, s.persona))
    sessions.forEach((s) => add(s.interest_level, s.persona))
    return interestLevelOptions.map((opt) => {
      const row: Record<string, string | number> = { name: opt.label }
      personaKeys.forEach((k) => { row[k] = matrix[opt.id]?.[k] ?? 0 })
      return row
    })
  }, [interest, submissions, sessions, interestLevelOptions, personaKeys])

  const stageDataStacked = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {}
    function add(stage: string | undefined, persona: string | undefined) {
      if (!stage || !persona) return
      if (!matrix[stage]) matrix[stage] = {}
      matrix[stage][persona] = (matrix[stage][persona] ?? 0) + 1
    }
    submissions.forEach((s) => {
      s.stage?.split(',').forEach((st) => add(st.trim(), s.persona))
    })
    sessions.forEach((s) => {
      const arr = s.answers?.stage
      if (Array.isArray(arr)) arr.forEach((st) => add(st, s.persona))
    })
    return stageOptions.map((opt) => {
      const row: Record<string, string | number> = { name: opt.label }
      personaKeys.forEach((k) => { row[k] = matrix[opt.id]?.[k] ?? 0 })
      return row
    })
  }, [submissions, sessions, stageOptions, personaKeys])

  const eventFrequencyDataStacked = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {}
    function add(freq: string | undefined, persona: string | undefined) {
      if (!freq || !persona) return
      if (!matrix[freq]) matrix[freq] = {}
      matrix[freq][persona] = (matrix[freq][persona] ?? 0) + 1
    }
    submissions.forEach((s) => add(s.event_frequency, s.persona))
    sessions.forEach((s) => {
      const v = Array.isArray(s.answers?.event_frequency) ? s.answers.event_frequency[0] : undefined
      add(v, s.persona)
    })
    return eventFrequencyOptions.map((opt) => {
      const row: Record<string, string | number> = { name: opt.label }
      personaKeys.forEach((k) => { row[k] = matrix[opt.id]?.[k] ?? 0 })
      return row
    })
  }, [submissions, sessions, eventFrequencyOptions, personaKeys])

  const improvementGoalDataStacked = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {}
    function add(goal: string | undefined, persona: string | undefined) {
      if (!goal || !persona) return
      if (!matrix[goal]) matrix[goal] = {}
      matrix[goal][persona] = (matrix[goal][persona] ?? 0) + 1
    }
    submissions.forEach((s) => {
      s.improvement_goal?.split(',').forEach((g) => add(g.trim(), s.persona))
    })
    sessions.forEach((s) => {
      const arr = s.answers?.improvement_goal
      if (Array.isArray(arr)) arr.forEach((g) => add(g, s.persona))
    })
    return improvementGoalOptions.map((opt) => {
      const row: Record<string, string | number> = { name: opt.label }
      personaKeys.forEach((k) => { row[k] = matrix[opt.id]?.[k] ?? 0 })
      return row
    })
  }, [submissions, sessions, improvementGoalOptions, personaKeys])

  const eventFrequencyData = useMemo(() => {
    const counts: Record<string, number> = {}
    submissions.forEach((s) => {
      const v = s.event_frequency
      if (v) counts[v] = (counts[v] ?? 0) + 1
    })
    sessions.forEach((s) => {
      const arr = s.answers?.event_frequency
      const v = Array.isArray(arr) ? arr[0] : undefined
      if (v) counts[v] = (counts[v] ?? 0) + 1
    })
    return eventFrequencyOptions.map((opt) => ({
      name: opt.label,
      count: counts[opt.id] ?? 0,
    }))
  }, [submissions, sessions, eventFrequencyOptions])

  const improvementGoalData = useMemo(() => {
    const counts: Record<string, number> = {}
    function add(goal: string | undefined) {
      if (!goal) return
      goal.split(',').forEach((g) => {
        const t = g.trim()
        if (t) counts[t] = (counts[t] ?? 0) + 1
      })
    }
    submissions.forEach((s) => add(s.improvement_goal))
    sessions.forEach((s) => {
      const arr = s.answers?.improvement_goal
      if (Array.isArray(arr)) arr.forEach((g) => add(g))
    })
    return improvementGoalOptions.map((opt) => ({
      name: opt.label,
      count: counts[opt.id] ?? 0,
    }))
  }, [submissions, sessions, improvementGoalOptions])

  const completedCount = sessions.filter((s) => s.completed).length
  const completionRate = sessions.length > 0 ? Math.round((completedCount / sessions.length) * 100) : 0
  const funnelData = [
    { name: 'Started', value: sessions.length },
    { name: 'Completed', value: completedCount },
  ].filter((d) => d.value > 0)

  const stepDropoff = useMemo(() => {
    const byStep = countBy(sessions, (s) => String(s.current_step))
    return Object.entries(byStep)
      .map(([step, value]) => ({ name: `Step ${step}`, step: Number(step), value }))
      .sort((a, b) => a.step - b.step)
  }, [sessions])

  const { personaInterestMatrix, personaInterestColumns } = useMemo(() => {
    const rows: Record<string, Record<string, number>> = {}
    function add(p: string | undefined, i: string | undefined) {
      if (!p || !i) return
      if (!rows[p]) rows[p] = {}
      rows[p][i] = (rows[p][i] ?? 0) + 1
    }
    submissions.forEach((s) => add(s.persona, s.interest_level))
    sessions.forEach((s) => { if (s.persona && s.interest_level) add(s.persona, s.interest_level) })
    const columns = Array.from(new Set(Object.values(rows).flatMap((r) => Object.keys(r)))).sort()
    return { personaInterestMatrix: rows, personaInterestColumns: columns }
  }, [submissions, sessions])

  const recentSubmissions = useMemo(() => {
    const withDate = submissions
      .filter((s) => s.created_at)
      .map((s) => ({ ...s, _date: new Date(s.created_at!).getTime() }))
    return withDate.sort((a, b) => b._date - a._date).slice(0, 5)
  }, [submissions])

  const uniquePersonas = useMemo(
    () => new Set([...submissions.map((s) => s.persona), ...sessions.map((s) => s.persona)].filter(Boolean)).size,
    [submissions, sessions]
  )

  const stageData = useMemo(() => {
    const counts: Record<string, number> = {}
    function add(stage: string | undefined) {
      if (!stage) return
      stage.split(',').forEach((s) => {
        const t = s.trim()
        if (t) counts[t] = (counts[t] ?? 0) + 1
      })
    }
    submissions.forEach((s) => add(s.stage))
    sessions.forEach((s) => {
      const arr = s.answers?.stage
      if (Array.isArray(arr)) arr.forEach((st) => add(st))
    })
    return stageOptions.map((opt) => ({
      name: opt.label,
      count: counts[opt.id] ?? 0,
    }))
  }, [submissions, sessions, stageOptions])

  const interestToSubmission = useMemo(() => {
    const interestCount = interest.length
    const submissionCount = submissions.length
    const conversion = interestCount > 0 ? Math.round((submissionCount / interestCount) * 100) : null
    return { interestCount, submissionCount, conversion }
  }, [interest.length, submissions.length])

  const submissionsOverTime = useMemo(() => {
    if (submissions.length === 0) return []
    const byDay: Record<string, number> = {}
    submissions.forEach((s) => {
      if (!s.created_at) return
      const d = new Date(s.created_at)
      if (Number.isNaN(d.getTime())) return
      const day = d.toISOString().slice(0, 10)
      byDay[day] = (byDay[day] ?? 0) + 1
    })
    const sorted = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b))
    return sorted.map(([date, count]) => {
      const d = new Date(date + 'T00:00:00.000Z')
      const name = Number.isNaN(d.getTime()) ? date : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })
      return { date, count, name }
    })
  }, [submissions])

  const isEmptyRange = submissions.length === 0 && sessions.length === 0 && interest.length === 0

  const stats = {
    totalSubmissions: submissions.length,
    totalInterest: interest.length,
    totalSessions: sessions.length,
    completedSessions: completedCount,
    completionRate,
    uniquePersonas,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-[var(--charcoal)]">Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          {TIME_RANGES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRange(value)}
              className={`rounded-xl py-2 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 ${
                range === value
                  ? 'gradient-bg text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[var(--accent)]/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {lastActivity && (
        <p className="text-sm text-gray-500">
          Last activity: {timeAgo(lastActivity)}
        </p>
      )}

      {isEmptyRange && (
        <div className={`${cardClass} border-[var(--accent)]/30 bg-[var(--accent)]/5`}>
          <p className="text-[var(--charcoal)] font-medium">No activity in this period.</p>
          <p className="text-sm text-gray-600 mt-1">Try a different time range or All time.</p>
        </div>
      )}

      <section>
        <h3 className="text-lg font-bold text-[var(--charcoal)] mb-4">Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Submissions" value={stats.totalSubmissions} />
          <StatCard label="Interest records" value={stats.totalInterest} />
          <StatCard label="Quiz started" value={stats.totalSessions} />
          <StatCard label="Completed" value={stats.completedSessions} sub={stats.totalSessions > 0 ? `${stats.completionRate}% completion rate` : undefined} />
          <StatCard label="Personas received" value={stats.uniquePersonas} />
          {interestToSubmission.interestCount > 0 && (
            <StatCard
              label="Interest → submission"
              value={interestToSubmission.conversion != null ? `${interestToSubmission.conversion}%` : '–'}
              sub={`${interestToSubmission.submissionCount} of ${interestToSubmission.interestCount} submitted`}
            />
          )}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-[var(--charcoal)] mb-4">Persona distribution</h3>
        <div className={cardClass}>
          {personaCounts.length > 0 ? (
            <div className="h-80 min-h-[320px] min-w-[300px] w-full">
              {mounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
                <BarChart data={personaCounts} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Count">
                    {personaCounts.map((entry, i) => (
                      <Cell key={i} fill={personaColors[entry.personaKey] ?? '#8c52ff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{emptyCopy}</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-[var(--charcoal)] mb-4">Interest level</h3>
        <div className={cardClass}>
          {interestDataStacked.length > 0 ? (
            <div className="h-80 min-h-[320px] min-w-[300px] w-full">
              {mounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
                <BarChart data={interestDataStacked} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  <Legend />
                  {personaKeys.map((key) => (
                    <Bar key={key} dataKey={key} stackId="interest" fill={personaColors[key] ?? '#8c52ff'} name={personaTitles[key] ?? key} radius={[0, 0, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{emptyCopy}</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-[var(--charcoal)] mb-4">Stage / audience breakdown</h3>
        <div className={cardClass}>
          {stageDataStacked.length > 0 ? (
            <div className="h-80 min-h-[320px] min-w-[300px] w-full">
              {mounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
                <BarChart data={stageDataStacked} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  <Legend />
                  {personaKeys.map((key) => (
                    <Bar key={key} dataKey={key} stackId="stage" fill={personaColors[key] ?? '#8c52ff'} name={personaTitles[key] ?? key} radius={[0, 0, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{emptyCopy}</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-[var(--charcoal)] mb-4">Event frequency</h3>
        <div className={cardClass}>
          {eventFrequencyDataStacked.length > 0 ? (
            <div className="h-80 min-h-[320px] min-w-[300px] w-full">
              {mounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
                <BarChart data={eventFrequencyDataStacked} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  <Legend />
                  {personaKeys.map((key) => (
                    <Bar key={key} dataKey={key} stackId="eventFreq" fill={personaColors[key] ?? '#8c52ff'} name={personaTitles[key] ?? key} radius={[0, 0, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{emptyCopy}</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-[var(--charcoal)] mb-4">Improvement goals</h3>
        <div className={cardClass}>
          {improvementGoalDataStacked.length > 0 ? (
            <div className="h-80 min-h-[320px] min-w-[300px] w-full">
              {mounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
                <BarChart data={improvementGoalDataStacked} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  <Legend />
                  {personaKeys.map((key) => (
                    <Bar key={key} dataKey={key} stackId="improvement" fill={personaColors[key] ?? '#8c52ff'} name={personaTitles[key] ?? key} radius={[0, 0, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{emptyCopy}</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-[var(--charcoal)] mb-4">Completion funnel</h3>
        <div className={cardClass}>
          {funnelData.length > 0 ? (
            <div className="h-80 min-h-[320px] min-w-[300px] w-full">
              {mounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
                <PieChart>
                  <Pie
                    data={funnelData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {funnelData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{emptyCopy}</p>
          )}
        </div>
      </section>

      {submissionsOverTime.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-[var(--charcoal)] mb-4">Submissions over time</h3>
          <div className={cardClass}>
            <div className="h-80 min-h-[320px] min-w-[300px] w-full">
              {mounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
                <BarChart data={submissionsOverTime} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Submissions" />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>
      )}

      <section>
        <h3 className="text-lg font-bold text-[var(--charcoal)] mb-4">Drop-off by step</h3>
        <div className={cardClass}>
          {stepDropoff.length > 0 ? (
            <div className="h-80 min-h-[320px] min-w-[300px] w-full">
              {mounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
                <BarChart data={stepDropoff} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="value" fill="#c4b5fd" radius={[4, 4, 0, 0]} name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{emptyCopy}</p>
          )}
        </div>
      </section>

      {Object.keys(personaInterestMatrix).length > 0 && personaInterestColumns.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-[var(--charcoal)] mb-4">Persona × interest</h3>
          <div className={cardClass}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 pr-4 font-semibold text-[var(--charcoal)]">Persona</th>
                    {personaInterestColumns.map((i) => (
                      <th key={i} className="pb-2 px-2 font-semibold text-gray-600">{i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(personaInterestMatrix).map(([personaKey, row]) => (
                    <tr key={personaKey} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium text-[var(--charcoal)]">{personaTitles[personaKey] ?? personaKey}</td>
                      {personaInterestColumns.map((i) => (
                        <td key={i} className="py-2 px-2 text-gray-600">{row[i] ?? '–'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {recentSubmissions.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-[var(--charcoal)] mb-4">Recent submissions</h3>
          <div className={cardClass}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 pr-4 font-semibold text-[var(--charcoal)]">Date</th>
                    <th className="pb-2 pr-4 font-semibold text-[var(--charcoal)]">Persona</th>
                    <th className="pb-2 pr-4 font-semibold text-[var(--charcoal)]">Interest</th>
                    <th className="pb-2 pr-4 font-semibold text-[var(--charcoal)]">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((s, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 pr-4 text-gray-600">{s.created_at ? timeAgo(s.created_at) : '–'}</td>
                      <td className="py-2 pr-4 font-medium text-[var(--charcoal)]">{personaTitles[s.persona ?? ''] ?? s.persona ?? '–'}</td>
                      <td className="py-2 pr-4 text-gray-600">{s.interest_level ?? '–'}</td>
                      <td className="py-2 pr-4 text-gray-600">{s.email ? `${s.email.slice(0, 3)}…${s.email.slice(-4)}` : '–'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section>
        <h3 className="text-lg font-bold text-[var(--charcoal)] mb-4">Export data</h3>
        <div className={cardClass}>
          {exportMessage && (
            <p className="text-sm text-[var(--accent)] mb-3" role="status">{exportMessage}</p>
          )}
          <ExportSection
            onExport={(filename) => {
              setExportMessage(`Exported: ${filename}`)
              setTimeout(() => setExportMessage(null), 2500)
            }}
          />
        </div>
      </section>
    </div>
  )
}

function ExportSection({ onExport }: { onExport: (filename: string) => void }) {
  const types = [
    { type: 'interest', label: 'Export Interest' },
    { type: 'sessions', label: 'Export Quiz Sessions' },
    { type: 'submissions', label: 'Export Submissions' },
    { type: 'combined', label: 'Export Combined' },
    { type: 'personas', label: 'Export Personas' },
    { type: 'questions', label: 'Export Questions' },
  ] as const

  async function handleExport(type: string) {
    const res = await fetch(`/api/admin/export?type=${type}`, { credentials: 'include' })
    if (!res.ok) return
    const blob = await res.blob()
    const disposition = res.headers.get('Content-Disposition')
    const match = disposition?.match(/filename="?([^";]+)"?/)
    const filename = match?.[1] ?? `export-${type}.json`
    onExport(filename)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-wrap gap-3">
      {types.map(({ type, label }) => (
        <button
          key={type}
          type="button"
          onClick={() => handleExport(type)}
          className="rounded-xl py-2.5 px-4 font-semibold text-white gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 text-sm"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
