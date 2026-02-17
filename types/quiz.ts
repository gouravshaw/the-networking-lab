export type Trait =
  | 'confidence'
  | 'conversation'
  | 'positioning'
  | 'followUp'
  | 'leverage'

export type PersonaKey =
  | 'overthinker'
  | 'silentObserver'
  | 'friendlyForgettable'
  | 'connectorDisappears'
  | 'passiveNetworker'
  | 'inconsistentSprinter'
  | 'identityExplorer'

export interface Option {
  id: string
  label: string
  traitImpact?: Partial<Record<Trait, number>>
  personaImpact?: Partial<Record<PersonaKey, number>>
}

export interface Question {
  id: string
  question: string
  multi: boolean
  options: Option[]
  /** When false, single-select questions require Next button instead of auto-advancing. Default true. */
  autoAdvance?: boolean
}
