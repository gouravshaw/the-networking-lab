import { promises as fs } from 'fs'
import path from 'path'

// On Vercel (and similar serverless), project dir is read-only; use /tmp so writes succeed.
// Data in /tmp is ephemeral (lost on cold starts). For persistent storage use a DB or Vercel Blob.
const DATA_DIR =
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
    ? path.join('/tmp', 'personas-quiz-data')
    : path.join(process.cwd(), 'data')
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json')
const INTEREST_FILE = path.join(DATA_DIR, 'interest.json')
const QUIZ_SESSIONS_FILE = path.join(DATA_DIR, 'quiz_sessions.json')

export type QuizSessionRecord = {
  sessionId: string
  started_at: string
  updated_at: string
  answers: Record<string, string[]>
  current_step: number
  interest_level?: string
  feedback_reasons?: string[]
  feedback_other?: string
  email?: string
  consent?: boolean
  persona?: string
  completed: boolean
}

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch {
    // Directory may already exist
  }
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content) as T
  } catch {
    await ensureDataDir()
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf-8')
    return fallback
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export async function getSubmissions(): Promise<unknown[]> {
  return readJsonFile<unknown[]>(SUBMISSIONS_FILE, [])
}

export async function appendSubmission(record: unknown): Promise<void> {
  const submissions = await getSubmissions()
  submissions.push(record)
  await writeJsonFile(SUBMISSIONS_FILE, submissions)
}

export async function getInterestRecords(): Promise<unknown[]> {
  return readJsonFile<unknown[]>(INTEREST_FILE, [])
}

export async function appendInterestRecord(record: unknown): Promise<void> {
  const records = await getInterestRecords()
  records.push(record)
  await writeJsonFile(INTEREST_FILE, records)
}

export async function upsertQuizSession(
  sessionId: string,
  partial: Partial<Omit<QuizSessionRecord, 'sessionId' | 'started_at'>>
): Promise<void> {
  const raw = await readJsonFile<unknown>(QUIZ_SESSIONS_FILE, [])
  const sessions = Array.isArray(raw) ? (raw as QuizSessionRecord[]) : []
  const now = new Date().toISOString()
  const existing = sessions.find((s) => s && typeof s === 'object' && s.sessionId === sessionId)

  if (existing) {
    Object.assign(existing, { ...partial, updated_at: now })
  } else {
    sessions.push({
      sessionId,
      started_at: now,
      updated_at: now,
      answers: partial.answers ?? {},
      current_step: partial.current_step ?? 0,
      interest_level: partial.interest_level,
      feedback_reasons: partial.feedback_reasons,
      feedback_other: partial.feedback_other,
      email: partial.email,
      consent: partial.consent,
      persona: partial.persona,
      completed: partial.completed ?? false,
    })
  }
  await writeJsonFile(QUIZ_SESSIONS_FILE, sessions)
}

export async function getQuizSessions(): Promise<QuizSessionRecord[]> {
  return readJsonFile<QuizSessionRecord[]>(QUIZ_SESSIONS_FILE, [])
}
