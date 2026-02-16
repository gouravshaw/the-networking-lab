# The Networking Lab

A lightweight, mobile-first web app that helps you prepare for, engage in, and follow up after networking conversations — all in one guided session.

## Features

### 🎯 Guided Session Mode
A 3-step flow that walks you through every networking interaction:
1. **Before** — Set a goal, rate your confidence, and read a personalised reset message.
2. **During** — Swipe through conversation prompts (openers, curiosity questions, closers) tailored to your profile.
3. **After** — Save a contact, pick a follow-up template, and reflect on the conversation.

### 🧠 Personalisation
First-time users see a landing page with an inline onboarding flow — 3 quick questions that shape the entire experience:
- **Who are you?** (student, graduate, career switcher, professional, entrepreneur)
- **Why are you networking?** (job, learning, growth, mentor, confidence)
- **What do you struggle with?** (confidence, starting conversations, talking about yourself, keeping conversations going, follow-up)

A prompt engine scores and ranks 15 tagged prompts based on your answers, so every session surfaces the most relevant content.

### 🗣️ Intro Builder
Build and save 3 types of personal introductions:
- **10-Second** — quick, memorable intro
- **30-Second** — elevator-style pitch
- **Project** — technical or project focus

Fill in guided fields and get a ready-to-copy introduction.

### 🧰 Toolbox
Ready-to-use lines organised by situation:
- In-person events
- Virtual meetings
- LinkedIn messages
- Follow-ups
- Graceful exits

Each line includes a contextual tip and a one-tap copy button.

### 👥 Contacts
Save people you meet during sessions. Each contact stores:
- Name, where you met, and personal notes
- Follow-up message (auto-generated from templates)
- Session history and date

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Routing | React Router DOM 6 |
| Icons | Lucide React |
| Build | Vite 6 |
| Styling | Vanilla CSS (custom design system) |
| Persistence | localStorage |

Zero backend. Everything runs client-side.

## Getting Started

```bash
# Clone
git clone https://github.com/gouravshaw/the-networking-lab.git
cd the-networking-lab

# Install
npm install

# Run
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── App.jsx                    # Routing
├── main.jsx                   # Entry point
├── index.css                  # Design system + all styles
├── components/
│   ├── TopNav.jsx             # Bottom navigation bar
│   └── CopyButton.jsx        # Reusable copy-to-clipboard
├── context/
│   ├── UserContext.jsx        # User state, contacts, sessions, preferences
│   └── ThemeContext.jsx       # Dark/light theme
├── data/
│   ├── promptEngine.js        # Tagged prompt bank + scoring engine
│   ├── sessionContent.js      # Session step content
│   └── toolboxContent.js      # Toolbox lines and tips
├── pages/
│   ├── Home.jsx               # Landing page + inline setup + main CTA
│   ├── Session.jsx            # 3-step guided session
│   ├── Setup.jsx              # Setup questions (shared with Home)
│   ├── IntroBuilder.jsx       # Intro creation tool
│   ├── Toolbox.jsx            # Copy-paste conversation lines
│   ├── Contacts.jsx           # Contact list
│   └── ContactDetail.jsx      # Individual contact view
└── utils/
```

## License

MIT
