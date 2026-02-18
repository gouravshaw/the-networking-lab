import type { Trait, PersonaKey } from '@/types/quiz'
import { questions } from '@/data/questions'

const TRAITS: Trait[] = [
  'confidence',
  'conversation',
  'positioning',
  'followUp',
  'leverage',
]

const PERSONA_KEYS: PersonaKey[] = [
  'overthinker',
  'silentObserver',
  'friendlyForgettable',
  'connectorDisappears',
  'passiveNetworker',
  'inconsistentSprinter',
  'identityExplorer',
]

export type TraitScores = Record<Trait, number>
export type PersonaScores = Record<PersonaKey, number>

export interface QuizResults {
  traitScores: TraitScores
  personaScores: PersonaScores
  dominantPersona: PersonaKey
  isOptimizer?: boolean
}

function getInitialTraitScores(): TraitScores {
  return TRAITS.reduce((acc, t) => ({ ...acc, [t]: 0 }), {} as TraitScores)
}

function getInitialPersonaScores(): PersonaScores {
  return PERSONA_KEYS.reduce((acc, p) => ({ ...acc, [p]: 0 }), {} as PersonaScores)
}

export function calculateResults(
  answers: Record<string, string[]>
): QuizResults {
  // 1. Initialize scores
  const traitScores = getInitialTraitScores()
  // Set neutral baseline for traits
  Object.keys(traitScores).forEach((key) => {
    traitScores[key as Trait] = 10
  })

  // To handle the "Reached First" tie-breaker, we need to track *when* (at which question index)
  // a persona first received points.
  const personaScores = getInitialPersonaScores()
  const personaFirstPointIndex: Partial<Record<PersonaKey, number>> = {}

  let isOptimizerCandidate = false

  // 2. Iterate through questions to calculate scores
  questions.forEach((question, index) => {
    const selectedIds = answers[question.id] ?? []
    if (selectedIds.length === 0) return

    // Special flag check for Q6 (past_6_months) option G (wants_optimize)
    if (question.id === 'past_6_months' && selectedIds.includes('wants_optimize')) {
      isOptimizerCandidate = true
    }

    for (const option of question.options) {
      if (!selectedIds.includes(option.id)) continue

      if (option.traitImpact) {
        for (const [trait, value] of Object.entries(option.traitImpact)) {
          if (trait in traitScores && typeof value === 'number') {
            traitScores[trait as Trait] += value
          }
        }
      }

      if (option.personaImpact) {
        for (const [persona, value] of Object.entries(option.personaImpact)) {
          if (persona in personaScores && typeof value === 'number') {
            personaScores[persona as PersonaKey] += value

            // Track when this persona first received points (for tie-breaking)
            if (value > 0 && personaFirstPointIndex[persona as PersonaKey] === undefined) {
              personaFirstPointIndex[persona as PersonaKey] = index
            }
          }
        }
      }
    }
  })

  // 3. Determine Dominant Persona
  let dominantPersona: PersonaKey = 'overthinker'
  let maxScore = -1

  // We need a stable sort to handle the tie-breaking logic.
  // The priority list is: Overthinker > Silent Observer > Friendly > Connector > Passive > Inconsistent > Identity
  // But strictly, we sort by:
  // 1. Score (High to Low)
  // 2. First Point Index (Low to High - i.e., who got points earlier)
  // 3. Defined Priority List (Index in PERSONA_KEYS)

  const sortedPersonas = PERSONA_KEYS.slice().sort((a, b) => {
    const scoreA = personaScores[a]
    const scoreB = personaScores[b]

    // 1. Highest Score
    if (scoreB !== scoreA) {
      return scoreB - scoreA
    }

    // 2. Reached First (Earliest Question Index)
    const firstIndexA = personaFirstPointIndex[a] ?? 999
    const firstIndexB = personaFirstPointIndex[b] ?? 999
    if (firstIndexA !== firstIndexB) {
      return firstIndexA - firstIndexB
    }

    // 3. Fallback to Fixed Priority List (which is the order of PERSONA_KEYS array)
    return PERSONA_KEYS.indexOf(a) - PERSONA_KEYS.indexOf(b)
  })

  dominantPersona = sortedPersonas[0]
  maxScore = personaScores[dominantPersona]

  // 4. Optimizer Logic
  // If optimizerCandidate=true AND scores are low (<= 3), set isOptimizer flag
  let isOptimizer = false
  if (isOptimizerCandidate && maxScore <= 3) {
    isOptimizer = true
  }

  return {
    traitScores,
    personaScores,
    dominantPersona,
    isOptimizer,
  }
}
