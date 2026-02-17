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
    tagline: 'Mentally prepared. Emotionally exhausted.',
    circleColor: 'blue',
    pattern:
      'You care deeply about making a good impression. You rehearse, reflect, and replay conversations. Your preparation is thorough—maybe too thorough. The pressure builds before you even enter the room.',
    risk:
      'If this continues, you will keep exhausting yourself before events. The mental load will grow. You may start avoiding networking altogether because the prep feels unsustainable.',
    solution:
      'The Networking Lab helps you reduce pre-event anxiety with a Mental Prep framework. Not more preparation—structured, low-pressure preparation. You learn to enter rooms without carrying the weight of perfection.',
    imagePath: '/images/personas/overthinker.svg',
  },
  silentObserver: {
    title: 'The Silent Observer',
    tagline: 'You attend. You watch. You rarely initiate.',
    circleColor: 'purple',
    pattern:
      'You show up. You listen. You analyse. But starting conversations feels heavy. You wait for the right moment, the right person, the right opener. The moment often never comes.',
    risk:
      'If this continues, you will keep leaving events with regret. Your network will stay small. Opportunities will pass because you never made the first move.',
    solution:
      'The Networking Lab teaches structured conversation initiation. Low-pressure openers, flow frameworks, exit strategies. You do not need to become extroverted. You need structure.',
    imagePath: '/images/personas/silent_observer.svg',
  },
  friendlyForgettable: {
    title: 'The Friendly but Forgettable',
    tagline: 'People like you. They just do not remember why.',
    circleColor: 'orange',
    pattern:
      'You connect easily. People enjoy talking to you. But when they leave, they struggle to recall what you do or why you matter. Your professional value gets lost in the warmth.',
    risk:
      'If this continues, you will keep having pleasant conversations that go nowhere. Your network will grow wide but shallow. Referrals and opportunities will go to people who positioned themselves clearly.',
    solution:
      'The Networking Lab helps you define your professional identity and craft a natural "what do you do?" response. Not rehearsed—memorable. This is where good conversations become opportunities.',
    imagePath: '/images/personas/friendly_forgettable.svg',
  },
  connectorDisappears: {
    title: 'The Connector Who Disappears',
    tagline: 'You meet people. Then momentum fades.',
    circleColor: 'green',
    pattern:
      'You exchange LinkedIn. You have good intentions. Then life happens. The follow-up never lands. The relationship cools. You have a growing list of contacts who do not really know you anymore.',
    risk:
      'If this continues, your network will become a graveyard of one-off connections. People will stop expecting to hear from you. When you need help, you will have to start from scratch.',
    solution:
      'The Networking Lab teaches follow-up timing, simple message frameworks, and relationship maintenance habits. Connections only grow if nurtured. We show you how to do it without it feeling like a chore.',
    imagePath: '/images/personas/connector_disappears.svg',
  },
  passiveNetworker: {
    title: 'The Passive Networker',
    tagline: 'You have contacts. Asking feels wrong.',
    circleColor: 'yellow',
    pattern:
      'You have a network. You have helped others. But asking for help, referrals, or introductions feels uncomfortable. You tell yourself you do not want to be that person. So you stay passive.',
    risk:
      'If this continues, you will keep under-leveraging what you have built. Others will advance because they asked. You will stay stuck because you did not.',
    solution:
      'The Networking Lab shows you how to ask without awkwardness. How to provide value first. How to activate dormant connections. Networking is not about using people. It is about mutual value.',
    imagePath: '/images/personas/passive_networker.svg',
  },
  inconsistentSprinter: {
    title: 'The Inconsistent Sprinter',
    tagline: 'You go hard. Then you disappear.',
    circleColor: 'teal',
    pattern:
      'You burst into action. You attend events, send messages, make plans. Then you burn out or get busy. Weeks of silence. When you return, you have to rebuild momentum from zero.',
    risk:
      'If this continues, people will stop taking your outreach seriously. You will be known as someone who shows up in waves and then vanishes. Consistency matters more than intensity.',
    solution:
      'The Networking Lab helps you build sustainable habits. Not sprints—systems. You learn to maintain presence without exhausting yourself. Steady beats sporadic.',
    imagePath: '/images/personas/overthinker.svg',
  },
  identityExplorer: {
    title: 'The Identity Explorer',
    tagline: 'Still figuring out who you are professionally.',
    circleColor: 'indigo',
    pattern:
      'You are in transition. Career switch, new role, or still defining your path. When people ask what you do, you hesitate. Your story feels unfinished. Networking feels harder when you are not sure of your own narrative.',
    risk:
      'If this continues, you will keep avoiding situations where you have to explain yourself. Opportunities will pass because you could not articulate your value. Clarity precedes confidence.',
    solution:
      'The Networking Lab helps you craft a professional identity that feels authentic. You learn to tell your story even when it is still evolving. You do not need to have it all figured out to show up.',
    imagePath: '/images/personas/friendly_forgettable.svg',
  },
}
