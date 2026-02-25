# The Networking Lab — Personas Quiz

A short quiz that reveals your networking persona. Users answer a series of questions, enter their email, and receive a personalised result with a radar chart breakdown and tailored advice. Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Features

- **7 Networking Personas** — Overthinker, Silent Observer, Friendly but Forgettable, Connector Who Disappears, Passive Networker, Inconsistent Sprinter, Identity Explorer
- **Email Gate** — collects user email before revealing results
- **Radar Chart Results** — visual breakdown of persona trait scores (powered by Recharts)
- **Animated UI** — smooth transitions via Framer Motion
- **Admin Dashboard** — view all quiz submissions and persona distribution at `/admin`
- **Vercel Analytics** — built-in usage tracking

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | Next.js 14 (App Router)           |
| Language    | TypeScript                        |
| Styling     | Tailwind CSS                      |
| Charts      | Recharts                          |
| Animations  | Framer Motion                     |
| Analytics   | Vercel Analytics                  |

## Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and set:

| Variable              | Description                                          |
|-----------------------|------------------------------------------------------|
| `ADMIN_USER`          | Username for the admin login                         |
| `ADMIN_PASSWORD`      | Password for the admin login                         |
| `ADMIN_SESSION_SECRET`| A long random string (32+ chars) for session signing |

### 3. Run the dev server

```bash
npm run dev
```

- **Quiz** → [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard** → [http://localhost:3000/admin](http://localhost:3000/admin)

### 4. Build for production (optional)

```bash
npm run build
npm start
```

---

> **Troubleshooting:** If the app fails to start or admin login doesn't work, make sure you created `.env` from `.env.example` and set all required variables.
