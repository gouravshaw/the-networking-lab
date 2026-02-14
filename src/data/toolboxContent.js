/**
 * Toolbox Content — Categorised conversation tools
 */

export const toolboxCategories = [
      {
            id: 'in-person',
            label: 'In-Person',
            icon: 'Users',
            items: [
                  { id: 'ip-1', text: "What brought you here today?", tip: 'Universal and natural' },
                  { id: 'ip-2', text: "How do you know the host / organiser?", tip: 'Creates common ground' },
                  { id: 'ip-3', text: "I'm [name] — I'm really interested in [topic]. What about you?", tip: 'Direct but warm' },
                  { id: 'ip-4', text: "Have you been to events like this before?", tip: 'Easy conversation starter' },
                  { id: 'ip-5', text: "That was a great talk — what did you think about [point]?", tip: 'After a presentation' },
                  { id: 'ip-6', text: "I love your [accessory/shirt/badge] — is there a story behind it?", tip: 'Genuine compliment opener' },
                  { id: 'ip-7', text: "Excuse me, mind if I join you? I don't know many people here.", tip: 'Honest and relatable' },
                  { id: 'ip-8', text: "What's your favourite thing about working in [industry]?", tip: 'Positive and engaging' },
            ],
      },
      {
            id: 'online',
            label: 'Online',
            icon: 'Monitor',
            items: [
                  { id: 'on-1', text: "Hi everyone! I'm [name], joining from [location]. Excited to learn about [topic].", tip: 'Introduce yourself in chat' },
                  { id: 'on-2', text: "Great point about [topic] — I've experienced something similar in my work with [area].", tip: 'Engage during Q&A' },
                  { id: 'on-3', text: "Would love to connect after this session if anyone is working on [topic].", tip: 'Signal openness' },
                  { id: 'on-4', text: "That's a perspective I hadn't considered — could you elaborate?", tip: 'Thoughtful follow-up' },
                  { id: 'on-5', text: "I really resonated with what [speaker] said about [point]. Anyone else?", tip: 'Open discussion' },
                  { id: 'on-6', text: "[Name], your question about [topic] was really insightful. Let's chat after!", tip: 'Direct reach-out' },
            ],
      },
      {
            id: 'linkedin',
            label: 'LinkedIn',
            icon: 'Linkedin',
            items: [
                  { id: 'li-1', text: "Hi [name], I came across your profile and was really impressed by your work in [field]. Would love to connect!", tip: 'Cold outreach' },
                  { id: 'li-2', text: "Hi [name], we met at [event] and I really enjoyed our conversation about [topic]. Great to connect here!", tip: 'Post-event connect' },
                  { id: 'li-3', text: "Hi [name], I'm exploring a career in [field] and your journey from [A] to [B] is really inspiring. Would you be open to a brief chat?", tip: 'Mentorship request' },
                  { id: 'li-4', text: "Your post about [topic] really resonated with me. I've been working on [related thing] — would love to exchange ideas.", tip: 'Content-based outreach' },
                  { id: 'li-5', text: "Hi [name], [mutual connection] suggested I reach out. I'd love to learn more about your experience at [company].", tip: 'Referral intro' },
            ],
      },
      {
            id: 'closers',
            label: 'Closers',
            icon: 'LogOut',
            items: [
                  { id: 'cl-1', text: "This has been great — would you be open to connecting on LinkedIn?", tip: 'Natural transition' },
                  { id: 'cl-2', text: "I've really enjoyed chatting. I'll let you mingle — hope we cross paths again!", tip: 'Graceful exit' },
                  { id: 'cl-3', text: "Thank you for sharing your insights — I'll definitely look into [thing they mentioned].", tip: 'Shows you listened' },
                  { id: 'cl-4', text: "I'd love to continue this conversation — would a coffee chat sometime work for you?", tip: 'Proactive follow-up' },
                  { id: 'cl-5', text: "It was great meeting you, [name]. I'm going to check out [other area], but let's keep in touch!", tip: 'Using their name' },
                  { id: 'cl-6', text: "I don't want to keep you, but I really appreciate your time. Enjoy the rest of the event!", tip: 'Respectful close' },
            ],
      },
];
