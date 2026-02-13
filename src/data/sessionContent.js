/**
 * Session Content — Static content for the Before → During → After flow
 */

// ── BEFORE STEP CONTENT ──

export const mentalReframes = [
      {
            id: 'reframe-1',
            text: "Networking isn't selling yourself — it's being curious about others.",
            category: 'mindset',
      },
      {
            id: 'reframe-2',
            text: "You don't need to impress anyone. A genuine question is more memorable than a polished pitch.",
            category: 'mindset',
      },
      {
            id: 'reframe-3',
            text: "Most people at events feel just as awkward as you do. You're not alone in this.",
            category: 'comfort',
      },
      {
            id: 'reframe-4',
            text: "One meaningful conversation is better than handing out 20 business cards.",
            category: 'quality',
      },
      {
            id: 'reframe-5',
            text: "Think of it as practice, not performance. Every interaction makes you better.",
            category: 'growth',
      },
      {
            id: 'reframe-6',
            text: "People want to help — most are flattered when you ask for advice or insight.",
            category: 'comfort',
      },
];

export const confidencePrepMessages = [
      {
            id: 'confidence-1',
            title: 'Take a Breath',
            text: "Before you walk in, pause. Take three slow breaths. You've prepared, you're ready, and you belong here.",
      },
      {
            id: 'confidence-2',
            title: 'Power Pose',
            text: "Stand tall for 30 seconds before entering. Open posture signals confidence — even to yourself.",
      },
      {
            id: 'confidence-3',
            title: 'Your Anchor',
            text: "Remind yourself of one thing you're genuinely proud of. That's the energy you want to bring in.",
      },
      {
            id: 'confidence-4',
            title: 'Set a Tiny Goal',
            text: "Don't aim for perfection. Aim for one real conversation. Just one. That's your win.",
      },
];

export const goalSuggestions = [
      'Meet 1 new person in my field',
      'Learn about someone\'s career path',
      'Practice my self-introduction',
      'Ask someone for advice on a challenge',
      'Find a potential mentor',
      'Learn about a new company or role',
      'Reconnect with someone I\'ve met before',
      'Step outside my comfort zone',
];

export const actionCommitments = [
      'I will introduce myself to at least one new person',
      'I will ask at least one open-ended question',
      'I will listen more than I talk',
      'I will remember and use people\'s names',
      'I will share something genuine about myself',
      'I will stay for at least 30 minutes',
      'I will follow up with someone within 48 hours',
];

// ── DURING STEP CONTENT ──

export const conversationStarters = {
      general: [
            { id: 'cs-1', text: "What brought you to this event?", context: 'Great universal opener' },
            { id: 'cs-2', text: "What are you working on at the moment?", context: 'Shows genuine interest' },
            { id: 'cs-3', text: "How did you get into your field?", context: 'People love sharing their story' },
            { id: 'cs-4', text: "What's the most interesting thing you've learned recently?", context: 'Sparks deeper conversation' },
            { id: 'cs-5', text: "Is this your first time at this type of event?", context: 'Low-pressure opener' },
      ],
      curiosity: [
            { id: 'cur-1', text: "What does a typical day look like in your role?", context: 'Learn about their work' },
            { id: 'cur-2', text: "What advice would you give someone starting out in your field?", context: 'Great for mentorship' },
            { id: 'cur-3', text: "What's changing in your industry right now?", context: 'Shows you want to learn' },
            { id: 'cur-4', text: "What do you wish you'd known earlier in your career?", context: 'Invites reflection' },
      ],
      followUp: [
            { id: 'fu-1', text: "That's interesting — can you tell me more about that?", context: 'Keep them talking' },
            { id: 'fu-2', text: "How did you handle that challenge?", context: 'Deepens the conversation' },
            { id: 'fu-3', text: "What would you do differently if you could?", context: 'Thoughtful follow-up' },
            { id: 'fu-4', text: "What excited you most about that experience?", context: 'Positive direction' },
            { id: 'fu-5', text: "That resonates with me — I've been thinking about something similar.", context: 'Build connection' },
      ],
};

export const introTemplate = {
      fields: [
            { key: 'whoIAm', label: 'Who I am', placeholder: 'e.g. I\'m a final-year design student at UCL', hint: 'Your current role or situation' },
            { key: 'whatIDo', label: 'What I do', placeholder: 'e.g. I focus on UX research and interaction design', hint: 'Your area of work or study' },
            { key: 'whatImExploring', label: 'What I\'m exploring', placeholder: 'e.g. I\'m looking into accessibility in fintech', hint: 'What you\'re curious about or working toward' },
      ],
      format: (values) => {
            const parts = [];
            if (values.whoIAm) parts.push(values.whoIAm);
            if (values.whatIDo) parts.push(values.whatIDo);
            if (values.whatImExploring) parts.push(values.whatImExploring);
            return parts.join('. ') + '.';
      },
};

export const confidenceBoostersDuring = [
      { id: 'cb-1', text: "Remember: asking questions is a superpower. Curious people are magnetic.", icon: 'Sparkles' },
      { id: 'cb-2', text: "It's okay to pause. Thoughtful silence shows you're really listening.", icon: 'Heart' },
      { id: 'cb-3', text: "You don't need to have all the answers. 'I'd love to learn more about that' is a perfect response.", icon: 'Lightbulb' },
      { id: 'cb-4', text: "If a conversation isn't flowing, it's fine to exit gracefully: 'Great meeting you — I'm going to grab a drink!'", icon: 'ArrowRight' },
];

// ── AFTER STEP CONTENT ──

export const followUpTemplates = [
      {
            id: 'fup-1',
            title: 'Quick Connect',
            template: "Hi {name}, it was great meeting you at {event}. I really enjoyed our conversation about {topic}. Let's stay in touch!",
            context: 'LinkedIn / casual follow-up',
      },
      {
            id: 'fup-2',
            title: 'Value Add',
            template: "Hi {name}, great connecting at {event}. You mentioned {topic} — I thought you might find this interesting: {resource}. Hope it's helpful!",
            context: 'When you have something to share',
      },
      {
            id: 'fup-3',
            title: 'Coffee Chat Request',
            template: "Hi {name}, I really enjoyed our conversation at {event}. I'd love to learn more about your experience in {field}. Would you be open to a 20-minute coffee chat sometime?",
            context: 'When you want to continue the relationship',
      },
      {
            id: 'fup-4',
            title: 'Thank You',
            template: "Hi {name}, thank you for sharing your insights about {topic} at {event}. Your advice on {advice} was really helpful and I'll definitely be acting on it.",
            context: 'After a mentorship-style conversation',
      },
];

export const reflectionPrompts = [
      'What went well in your interactions today?',
      'What\'s one thing you learned about someone?',
      'Did you feel more confident than you expected?',
      'What would you try differently next time?',
      'Who did you most enjoy talking to, and why?',
];

export const positiveReinforcements = [
      "You showed up and put yourself out there — that takes real courage. 💪",
      "Every conversation is practice. You're building a skill most people avoid.",
      "Networking gets easier every time. You're already further than you think.",
      "The hardest part was showing up, and you did it. Well done! ✨",
      "Remember: relationships take time. Today's small step could lead to big things.",
];
