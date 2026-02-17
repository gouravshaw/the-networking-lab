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
  const traitScores = getInitialTraitScores()
  const personaScores = getInitialPersonaScores()

  for (const question of questions) {
    const selectedIds = answers[question.id] ?? []
    if (selectedIds.length === 0) continue

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
          }
        }
      }
    }
  }

  let dominantPersona: PersonaKey = 'overthinker'
  let maxScore = 0

  for (const key of PERSONA_KEYS) {
    if (personaScores[key] > maxScore) {
      maxScore = personaScores[key]
      dominantPersona = key
    }
  }

  return {
    traitScores,
    personaScores,
    dominantPersona,
  }
}
