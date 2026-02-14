/**
 * Prompt Engine — Tagged prompt bank with personalisation scoring
 *
 * Each prompt has:
 * - text: the actual line
 * - type: opener | curiosity | follow-up | closer
 * - label: short contextual tip
 * - tags: { reasons, categories, difficulties } — arrays of matching values
 *
 * buildPersonalisedCards(preferences) scores prompts against user prefs
 * and returns the top 5–6 most relevant.
 */

const promptBank = [
      // ── Openers ──
      {
            text: "What brought you to this event?",
            type: 'opener',
            label: 'Universal opener',
            tags: { reasons: [], categories: [], difficulties: ['starting-conversations'] },
      },
      {
            text: "What are you working on right now?",
            type: 'opener',
            label: 'Direct and engaging',
            tags: { reasons: ['job', 'career-growth'], categories: ['professional', 'entrepreneur'], difficulties: ['starting-conversations'] },
      },
      {
            text: "Hi, I'm exploring [field] — what's your background?",
            type: 'opener',
            label: 'Shows intention',
            tags: { reasons: ['learning', 'mentor'], categories: ['student', 'career-switcher'], difficulties: ['starting-conversations', 'talking-about-myself'] },
      },
      {
            text: "I'm new to events like this — any tips?",
            type: 'opener',
            label: 'Honest and disarming',
            tags: { reasons: ['confidence'], categories: ['student', 'graduate'], difficulties: ['confidence', 'starting-conversations'] },
      },
      {
            text: "What opportunities are you most excited about right now?",
            type: 'opener',
            label: 'Opportunity-focused',
            tags: { reasons: ['job', 'career-growth'], categories: ['professional', 'graduate'], difficulties: ['starting-conversations'] },
      },

      // ── Curiosity ──
      {
            text: "What's changing in your industry right now?",
            type: 'curiosity',
            label: 'Shows you want to learn',
            tags: { reasons: ['learning', 'career-growth'], categories: ['professional', 'career-switcher'], difficulties: ['keeping-going'] },
      },
      {
            text: "What advice would you give someone starting out in your field?",
            type: 'curiosity',
            label: 'Great for mentorship',
            tags: { reasons: ['mentor', 'learning'], categories: ['student', 'graduate', 'career-switcher'], difficulties: ['keeping-going'] },
      },
      {
            text: "How did you get into what you do?",
            type: 'curiosity',
            label: 'People love sharing their story',
            tags: { reasons: ['learning', 'mentor'], categories: [], difficulties: ['keeping-going'] },
      },
      {
            text: "What's the most interesting project you've worked on recently?",
            type: 'curiosity',
            label: 'Sparks deeper conversation',
            tags: { reasons: ['job', 'learning'], categories: ['professional', 'entrepreneur'], difficulties: ['keeping-going'] },
      },

      // ── Follow-ups ──
      {
            text: "That's interesting — can you tell me more?",
            type: 'follow-up',
            label: 'Keep them talking',
            tags: { reasons: [], categories: [], difficulties: ['keeping-going'] },
      },
      {
            text: "What would you do differently if you were starting over?",
            type: 'follow-up',
            label: 'Invites reflection',
            tags: { reasons: ['mentor', 'career-growth'], categories: ['career-switcher'], difficulties: ['keeping-going'] },
      },
      {
            text: "That resonates with me — I've been thinking about something similar.",
            type: 'follow-up',
            label: 'Build connection',
            tags: { reasons: ['confidence'], categories: [], difficulties: ['talking-about-myself', 'confidence'] },
      },

      // ── Closers ──
      {
            text: "Great chatting — would you be open to connecting on LinkedIn?",
            type: 'closer',
            label: 'Natural transition',
            tags: { reasons: ['job', 'career-growth'], categories: [], difficulties: ['follow-up'] },
      },
      {
            text: "I'd love to continue this conversation — could we grab a coffee sometime?",
            type: 'closer',
            label: 'Proactive follow-up',
            tags: { reasons: ['mentor', 'learning'], categories: [], difficulties: ['follow-up'] },
      },
      {
            text: "Thanks for sharing your insights — I'll definitely look into that.",
            type: 'closer',
            label: 'Shows you listened',
            tags: { reasons: ['learning'], categories: ['student', 'graduate'], difficulties: ['follow-up'] },
      },
];

/**
 * Score a prompt against user preferences.
 * +2 for each matching difficulty tag
 * +1 for each matching reason tag
 * +1 for each matching category tag
 * Prompts with empty tag arrays are treated as universal (small base score)
 */
function scorePrompt(prompt, preferences) {
      const { category, reason, difficulty } = preferences;
      let score = 0;

      if (difficulty && prompt.tags.difficulties.includes(difficulty)) score += 2;
      if (reason && prompt.tags.reasons.includes(reason)) score += 1;
      if (category && prompt.tags.categories.includes(category)) score += 1;

      // Universal prompts (empty tags) get a small base score so they're not excluded
      const totalTags = prompt.tags.difficulties.length + prompt.tags.reasons.length + prompt.tags.categories.length;
      if (totalTags === 0) score += 0.5;

      return score;
}

/**
 * Build personalised prompt cards for the session.
 * Returns 5–6 prompts sorted by relevance, ensuring type diversity.
 */
export function buildPersonalisedCards(preferences) {
      // No preferences? Return universal defaults
      if (!preferences || (!preferences.category && !preferences.reason && !preferences.difficulty)) {
            return promptBank.slice(0, 5).map(p => ({
                  text: p.text,
                  type: p.type,
                  label: p.label,
            }));
      }

      // Score and sort
      const scored = promptBank.map(p => ({
            ...p,
            score: scorePrompt(p, preferences),
      }));

      scored.sort((a, b) => b.score - a.score);

      // Pick top results ensuring we have at least one of each type if possible
      const result = [];
      const usedTypes = new Set();
      const TARGET = 6;

      // First pass: pick highest-scoring prompt per type
      for (const prompt of scored) {
            if (result.length >= TARGET) break;
            if (!usedTypes.has(prompt.type)) {
                  result.push(prompt);
                  usedTypes.add(prompt.type);
            }
      }

      // Second pass: fill remaining slots with highest-scoring unused prompts
      for (const prompt of scored) {
            if (result.length >= TARGET) break;
            if (!result.includes(prompt)) {
                  result.push(prompt);
            }
      }

      // Sort result: openers first, then curiosity, follow-up, closer
      const typeOrder = { opener: 0, curiosity: 1, 'follow-up': 2, closer: 3 };
      result.sort((a, b) => (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9));

      return result.map(p => ({
            text: p.text,
            type: p.type,
            label: p.label,
      }));
}

/**
 * Get a personalised Reset step message based on difficulty.
 */
export function getResetMessage(difficulty) {
      switch (difficulty) {
            case 'confidence':
                  return "You belong here. Take one breath.";
            case 'starting-conversations':
                  return "You have great questions ready. Take one breath.";
            case 'talking-about-myself':
                  return "You have a story worth sharing. Take one breath.";
            case 'keeping-going':
                  return "Curiosity is your superpower. Take one breath.";
            case 'follow-up':
                  return "Connections start here. Take one breath.";
            default:
                  return "Take one breath.";
      }
}
