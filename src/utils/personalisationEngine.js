/**
 * Personalisation Engine
 * Maps user difficulty → primary route and generates tone-adjusted content.
 */

// Route definitions
export const ROUTES = {
      DISCOVER: 'discover',
      MOTIVATION: 'motivation',
      START_FLOW: 'start-flow',
      SELF_PRESENTATION: 'self-presentation',
      FOLLOW_UP: 'follow-up',
};

// Map difficulty to primary route
const difficultyToRoute = {
      'Finding the right event': ROUTES.DISCOVER,
      'Lack of motivation to attend': ROUTES.MOTIVATION,
      'Starting conversations': ROUTES.START_FLOW,
      'Talking about myself clearly': ROUTES.SELF_PRESENTATION,
      'Keeping conversations going': ROUTES.START_FLOW,
      'Lack of confidence': ROUTES.MOTIVATION,
      'Maintaining my network': ROUTES.FOLLOW_UP,
      'Knowing when/how to follow up': ROUTES.FOLLOW_UP,
};

// Route display info
export const routeInfo = {
      [ROUTES.DISCOVER]: {
            title: 'Discover',
            description: 'Find aligned networking events',
            icon: 'Search',
            color: '#7c9a8e',
      },
      [ROUTES.MOTIVATION]: {
            title: 'Prepare',
            description: 'Build confidence & mental readiness',
            icon: 'Sparkles',
            color: '#c4975a',
      },
      [ROUTES.START_FLOW]: {
            title: 'Connect',
            description: 'Start & sustain conversations',
            icon: 'MessageCircle',
            color: '#6b9e7a',
      },
      [ROUTES.SELF_PRESENTATION]: {
            title: 'Present',
            description: 'Introduce yourself clearly',
            icon: 'User',
            color: '#8e7cb0',
      },
      [ROUTES.FOLLOW_UP]: {
            title: 'Follow Up',
            description: 'Maintain & grow connections',
            icon: 'Send',
            color: '#b07c8e',
      },
};

// Get the primary route for a user's difficulty
export function getPrimaryRoute(difficulty) {
      return difficultyToRoute[difficulty] || ROUTES.START_FLOW;
}

// Get ordered route list based on difficulty (primary first)
export function getOrderedRoutes(difficulty) {
      const primary = getPrimaryRoute(difficulty);
      const allRoutes = Object.values(ROUTES);
      return [primary, ...allRoutes.filter(r => r !== primary)];
}

// Tone adjustments based on user category
const toneMap = {
      'Student': {
            greeting: 'Hey there',
            encouragement: 'You\'re already ahead of the curve by practising this early!',
            tone: 'casual',
            exampleContext: 'university events, career fairs, study groups',
      },
      'Recent graduate / early career': {
            greeting: 'Welcome',
            encouragement: 'Every connection you make now builds the foundation of your career.',
            tone: 'supportive',
            exampleContext: 'industry meetups, alumni events, professional mixers',
      },
      'Career switcher': {
            greeting: 'Hello',
            encouragement: 'Your diverse experience is an asset — people love hearing different perspectives.',
            tone: 'empowering',
            exampleContext: 'cross-industry events, skill-share meetups, professional communities',
      },
      'Working professional': {
            greeting: 'Welcome back',
            encouragement: 'Strategic networking is the most underused tool for career growth.',
            tone: 'professional',
            exampleContext: 'conferences, leadership forums, industry roundtables',
      },
      'Entrepreneur / freelancer': {
            greeting: 'Hey',
            encouragement: 'Every conversation could lead to your next opportunity, client, or partner.',
            tone: 'energetic',
            exampleContext: 'startup events, pitch nights, co-working spaces, business meetups',
      },
};

export function getToneForCategory(category) {
      return toneMap[category] || toneMap['Working professional'];
}

// Get session content priority based on difficulty
export function getSessionFocus(difficulty) {
      const route = getPrimaryRoute(difficulty);

      const focusMap = {
            [ROUTES.DISCOVER]: {
                  beforeFocus: 'goal-setting',
                  duringFocus: 'event-tips',
                  afterFocus: 'reflection',
            },
            [ROUTES.MOTIVATION]: {
                  beforeFocus: 'mental-prep',
                  duringFocus: 'confidence-boosters',
                  afterFocus: 'positive-reinforcement',
            },
            [ROUTES.START_FLOW]: {
                  beforeFocus: 'goal-setting',
                  duringFocus: 'conversation-starters',
                  afterFocus: 'contact-save',
            },
            [ROUTES.SELF_PRESENTATION]: {
                  beforeFocus: 'intro-prep',
                  duringFocus: 'intro-template',
                  afterFocus: 'contact-save',
            },
            [ROUTES.FOLLOW_UP]: {
                  beforeFocus: 'goal-setting',
                  duringFocus: 'follow-up-prompts',
                  afterFocus: 'follow-up-action',
            },
      };

      return focusMap[route] || focusMap[ROUTES.START_FLOW];
}

// Check if confidence-related difficulty
export function needsConfidencePrep(difficulty) {
      return difficulty === 'Lack of confidence' || difficulty === 'Lack of motivation to attend';
}
