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
      'You rehearse conversations long before the event starts. You research attendees, plan talking points, and mentally simulate every scenario. By the time you walk through the door, half your energy is already gone. You leave feeling drained, even when it went fine. And the worst part? Nobody even notices the effort.',
    risk:
      'Every time you skip an event because the prep feels like too much, your world gets a little smaller. One declined invitation at a time. One missed introduction at a time. Until your professional circle has quietly shrunk, and the doors that used to open have stopped opening.',
    solution:
      'You will never walk into a room feeling unprepared again. Your full report includes a Ready-in-5 Prep Kit: just 5 minutes of focus before any event, and you will feel more confident than people who did zero prep.',
    imagePath: '/images/personas/overthinker.svg',
  },
  silentObserver: {
    title: 'The Silent Observer',
    tagline: 'You attend. You watch. You rarely initiate.',
    circleColor: 'purple',
    pattern:
      'You show up with good intentions, but the room feels like it is already running without you. Everyone seems to know each other. You wait for the "right moment" to jump in, but it never feels right. So you hover near the refreshments, check your phone, and leave having spoken to maybe one or two people.',
    risk:
      'Every event you leave quietly is a missed chapter in your career. The person standing three feet away could have been your next mentor or collaborator. This pattern gets worse, not better. Your professional world narrows to only the people who happen to reach out to you.',
    solution:
      'You do not need to be loud to make real connections. Your report includes 3 Plug-and-Play Openers that work in any room. No small talk, no awkwardness. Just easy first moves that start real conversations.',
    imagePath: '/images/personas/silent_observer.svg',
  },
  friendlyForgettable: {
    title: 'The Friendly but Forgettable',
    tagline: 'People like you. They just don\'t remember why.',
    circleColor: 'orange',
    pattern:
      'You are warm, approachable, and easy to talk to. Your conversations feel great in the moment. But a week later, the people you met cannot remember what you do or how they could help you. You get filed under "nice person I met" instead of "someone I should connect with my colleague."',
    risk:
      'You are doing the hardest part of networking: showing up and building rapport. But without a memorable anchor, none of it converts. People will not refer you or tag you in opportunities, not because they dislike you, but because they cannot remember what you bring to the table.',
    solution:
      'People will finally remember you for the right reasons. Your report includes a Seed Statement Builder: one sentence that plants an idea about your value, so people think of you when opportunities come up.',
    imagePath: '/images/personas/friendly_forgettable.svg',
  },
  connectorDisappears: {
    title: 'The Connector Who Disappears',
    tagline: 'You meet people. Then momentum fades.',
    circleColor: 'green',
    pattern:
      'You meet someone great, exchange details, and leave genuinely excited. You tell yourself you will follow up tomorrow. But tomorrow turns into next week, next week turns into "it has been too long now," and the connection goes cold. It is not that you do not care. There is just no system to catch the ball.',
    risk:
      'Every cold connection is not just one lost contact. It is an entire chain of introductions that will never happen. Networking works like compound interest, but the compounding never starts for you because every connection resets to zero. You keep meeting people but never building on what you have.',
    solution:
      'You will never lose a connection again. Your report includes a 48-Hour Follow-Up System with ready-to-send templates and a simple timing rhythm, so staying in touch happens automatically, not accidentally.',
    imagePath: '/images/personas/connector_disappears.svg',
  },
  passiveNetworker: {
    title: 'The Passive Networker',
    tagline: 'You have contacts. Asking feels wrong.',
    circleColor: 'yellow',
    pattern:
      'You always say yes when someone asks for help. But when it comes to asking for anything in return, you freeze. It feels pushy or transactional. So you sit on a network full of people who would happily help you, but you never give them the chance.',
    risk:
      'The people advancing faster around you are not more talented. They are just willing to ask. Your network does not even know you need anything, so they cannot help. Over time, this creates invisibility: you are always there for everyone else, while nobody is there for you.',
    solution:
      'Asking does not have to feel uncomfortable. Your report includes Capital-Building Scripts: simple, natural questions that activate your network without feeling pushy. The people around you want to help. You just need to let them.',
    imagePath: '/images/personas/passive_networker.svg',
  },
  inconsistentSprinter: {
    title: 'The Inconsistent Sprinter',
    tagline: 'You go hard. Then you stop.',
    circleColor: 'teal',
    pattern:
      'Something lights a fire. You go all in: three events in one week, a dozen LinkedIn messages, multiple coffee meetings. But within weeks, the energy fades. You go silent for months. When you resurface, the people you met have moved on. You are starting from zero, again.',
    risk:
      'Every time you sprint and disappear, you train your network to ignore you. People stop taking your messages seriously because they know you will vanish again. And the most painful part: you always quit right before the results would have arrived. Consistency is the thing that makes networking work.',
    solution:
      'You do not need more motivation. You need a system. Your report includes a Networking Cadence Plan: 15 minutes a week of small, steady actions that compound over time. No burnout. No starting over. Just quiet momentum that builds.',
    imagePath: '/images/personas/inconsistent_sprinter.svg',
  },
  identityExplorer: {
    title: 'The Identity Explorer',
    tagline: 'Still figuring out your story.',
    circleColor: 'indigo',
    pattern:
      'You are in a period of change. When someone asks "so what do you do?", you hesitate. The answer feels too complicated or incomplete. So you give a vague response that confuses people, or fall back on an old title that no longer fits. The conversation loses energy, and you walk away feeling like you cannot network until you have it all figured out.',
    risk:
      'You are waiting for clarity before you start networking. But clarity comes from talking to people, not sitting alone. Every week you spend waiting is a week your world gets quieter. Others in the same transition are already out there having messy conversations and building relationships. They are not more ready. They just started.',
    solution:
      'You do not need to have it all figured out to start networking. Your report includes a Transition Story Framework that turns your evolving path into a strength. So when someone asks what you do, you will have an answer that feels honest, clear, and interesting.',
    imagePath: '/images/personas/identity_explorer.svg',
  },
}
