import { v4 as uuidv4 } from 'uuid'

export type SessionPayload = {
  sessionId: string
  step: string | number
  answers?: Record<string, string[]>
  interestLevel?: string
  email?: string
  feedbackReasons?: string[]
  feedbackOther?: string
  timestamp: string
}

export function createSessionId(): string {
  return uuidv4()
}

export function logSessionProgress(
  sessionId: string,
  payload: Omit<SessionPayload, 'sessionId' | 'timestamp'>
): void {
  const fullPayload: SessionPayload = {
    sessionId,
    ...payload,
    timestamp: new Date().toISOString(),
  }
  // Firebase-ready structure: log now, plug in later
  console.log('[Session]', JSON.stringify(fullPayload, null, 2))
}
