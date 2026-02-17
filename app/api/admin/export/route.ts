import { NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { getSubmissions, getInterestRecords, getQuizSessions } from '@/lib/data'
import { personas } from '@/data/personas'
import { questions } from '@/data/questions'

const EXPORT_TYPES = ['interest', 'sessions', 'submissions', 'combined', 'personas', 'questions'] as const
type ExportType = (typeof EXPORT_TYPES)[number]

function isValidType(t: string): t is ExportType {
  return EXPORT_TYPES.includes(t as ExportType)
}

const FILENAMES: Record<ExportType, string> = {
  interest: 'interest.json',
  sessions: 'quiz_sessions.json',
  submissions: 'submissions.json',
  combined: 'export_combined.json',
  personas: 'personas.json',
  questions: 'questions.json',
}

export async function GET(request: Request) {
  const session = getSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  if (!type || !isValidType(type)) {
    return NextResponse.json(
      { error: 'Invalid or missing type. Use: interest, sessions, submissions, combined, personas, questions' },
      { status: 400 }
    )
  }
  try {
    let data: unknown
    switch (type) {
      case 'interest':
        data = await getInterestRecords()
        break
      case 'sessions':
        data = await getQuizSessions()
        break
      case 'submissions':
        data = await getSubmissions()
        break
      case 'combined':
        data = {
          interest: await getInterestRecords(),
          quiz_sessions: await getQuizSessions(),
          submissions: await getSubmissions(),
        }
        break
      case 'personas':
        data = personas
        break
      case 'questions':
        data = questions
        break
      default:
        data = null
    }
    const json = JSON.stringify(data, null, 2)
    const filename = FILENAMES[type]
    return new NextResponse(json, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('Export error:', err)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
