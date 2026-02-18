import type { PersonaKey } from '@/types/quiz'

/** Persona circle accent color – change these to update all personas */
export const PERSONA_CIRCLE_COLORS = {
  blue: { border: 'border-blue-400', bg: 'bg-blue-50', ring: 'ring-blue-200' },
  purple: { border: 'border-purple-400', bg: 'bg-purple-50', ring: 'ring-purple-200' },
  orange: { border: 'border-orange-400', bg: 'bg-orange-50', ring: 'ring-orange-200' },
  green: { border: 'border-green-400', bg: 'bg-green-50', ring: 'ring-green-200' },
  yellow: { border: 'border-yellow-400', bg: 'bg-yellow-50', ring: 'ring-yellow-200' },
  teal: { border: 'border-teal-400', bg: 'bg-teal-50', ring: 'ring-teal-200' },
  indigo: { border: 'border-indigo-400', bg: 'bg-indigo-50', ring: 'ring-indigo-200' },
} as const

export type PersonaCircleColor = keyof typeof PERSONA_CIRCLE_COLORS

export interface Persona {
  title: string
  tagline: string
  pattern: string
  risk: string
  solution: string
  imagePath: string
  circleColor: PersonaCircleColor
}

export const personas: Record<PersonaKey, Persona> = {
  overthinker: {
    title: 'The Overthinker',
    tagline: 'You prepare. You rehearse. You exhaust yourself.',
    circleColor: 'blue',
    pattern:
      'This is what happens in real life: You care deeply about making a good impression. You script conversations in your head before you even enter the room. By the time you arrive, you’ve already spent half your energy.',
    risk:
      'Without a simple system, networking becomes a heavy mental lift. You may start avoiding events simply because the preparation feels unsustainable.',
    solution:
      'This is fixable with simple workflows. The Networking Lab gives you a "Low-Pressure Prep" framework—just enough structure to feel ready, without the script. You learn to trust yourself in the moment.',
    imagePath: '/images/personas/overthinker.svg',
  },
  silentObserver: {
    title: 'The Silent Observer',
    tagline: 'You attend. You watch. You rarely initiate.',
    circleColor: 'purple',
    pattern:
      'This is what happens in real life: You show up, but you wait for the "right moment" to speak. It often feels like everyone else knows what they’re doing, so you stay on the edges.',
    risk:
      'Without a simple system, you leave events with regret. Opportunities pass by simply because you didn’t make the first move.',
    solution:
      'This is fixable with simple workflows. We teach you low-stakes openers that require zero charisma. You don’t need to be loud; you just need a way to start.',
    imagePath: '/images/personas/silent_observer.svg',
  },
  friendlyForgettable: {
    title: 'The Friendly but Forgettable',
    tagline: 'People like you. They just don’t remember why.',
    circleColor: 'orange',
    pattern:
      'This is what happens in real life: You have great conversations and people enjoy your company. But when they walk away, they struggle to recall exactly what you do or how they could help you.',
    risk:
      'Without a simple system, your network grows wide but shallow. You become a "nice person" to know, rather than a valuable professional resource.',
    solution:
      'This is fixable with simple workflows. We help you craft a clearer professional identity. Not a sales pitch, but a memorable way to plant a seed about your value.',
    imagePath: '/images/personas/friendly_forgettable.svg',
  },
  connectorDisappears: {
    title: 'The Connector Who Disappears',
    tagline: 'You meet people. Then momentum fades.',
    circleColor: 'green',
    pattern:
      'This is what happens in real life: You exchange details and have every intention of staying in touch. Then the week gets busy, the moment passes, and the connection cools off.',
    risk:
      'Without a simple system, connections fade naturally. Your network becomes a collection of "people I met once" rather than active relationships.',
    solution:
      'This is fixable with simple workflows. We give you a follow-up dominance strategy—templates and timing that take the thinking out of staying in touch.',
    imagePath: '/images/personas/connector_disappears.svg',
  },
  passiveNetworker: {
    title: 'The Passive Networker',
    tagline: 'You have contacts. Asking feels wrong.',
    circleColor: 'yellow',
    pattern:
      'This is what happens in real life: You’re happy to help others, but you hesitate to ask for anything in return. You worry about being "transactional," so you never leverage the network you’ve built.',
    risk:
      'Without a simple system, you leave opportunities on the table. Others advance because they asked; you stay stuck because you didn’t.',
    solution:
      'This is fixable with simple workflows. We show you how to activate your network with "Capital-Building" asks—questions that feel natural, not demanding.',
    imagePath: '/images/personas/passive_networker.svg',
  },
  inconsistentSprinter: {
    title: 'The Inconsistent Sprinter',
    tagline: 'You go hard. Then you stop.',
    circleColor: 'teal',
    pattern:
      'This is what happens in real life: You get a burst of energy and attend three events in a week. Then you burn out or get busy, and go silent for months.',
    risk:
      'Without a simple system, you’re always starting from zero. Consistency builds trust; sprinting destroys it.',
    solution:
      'This is fixable with simple workflows. We replace the sprints with a sustainable "Networking Cadence"—small, steady actions that compound over time.',
    imagePath: '/images/personas/overthinker.svg',
  },
  identityExplorer: {
    title: 'The Identity Explorer',
    tagline: 'Still figuring out your story.',
    circleColor: 'indigo',
    pattern:
      'This is what happens in real life: You’re in transition or exploring new paths. When someone asks "what do you do?", you hesitate because the answer feels complicated.',
    risk:
      'Without a simple system, you avoid huge opportunities because you don’t feel ready to explain yourself. Clarity follows action, not the other way around.',
    solution:
      'This is fixable with simple workflows. We help you tell a "Transition Story"—framing your journey as a strength, so you can network confidently while you figure it out.',
    imagePath: '/images/personas/friendly_forgettable.svg',
  },
}
