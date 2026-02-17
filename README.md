# The Networking Lab - Personas Quiz

A short quiz that helps people discover their networking persona. Built with Next.js.

## Run locally

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

**Important:** Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and set:

- **Admin (for `/admin` login and dashboard)**  
  - `ADMIN_USER` – username for admin login  
  - `ADMIN_PASSWORD` – password for admin login  
  - `ADMIN_SESSION_SECRET` – a long random string (e.g. 32+ characters) for session signing  

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The quiz runs on the home page; the admin dashboard is at [http://localhost:3000/admin](http://localhost:3000/admin) (log in with the credentials from `.env`).

### 4. Build for production (optional)

```bash
npm run build
npm start
```

---

**Reminder:** If the app fails to start or admin login doesn’t work, check that you created `.env` from `.env.example` and set all required variables.
