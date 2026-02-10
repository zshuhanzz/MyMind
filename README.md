# My Mind

A mental wellness web app where users can check in with their mood daily, talk to an AI companion named Luna, write journal entries, and track their emotional patterns over time.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Recharts
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **AI:** Google Gemini API (gemini-2.5-flash)

## Prerequisites

Make sure you have these installed to run locally: Node.js, PostgreSQL, Google gemini API key


1. Clone the repository
```bash
git clone <your-repo-url>
cd testingone
```


### 2. Install dependencies

From the root of the project, run:

```bash
npm install
```

This installs dependencies for both the client and server (npm workspaces).

### 3. Set up the database

Open your PostgreSQL shell (psql) or a tool like pgAdmin and create a database:

```sql
CREATE DATABASE mymind;
```

If you want to use a specific user:

```sql
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE mymind TO myuser;
```

### 4. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and update these fields:

```
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mymind
GEMINI_API_KEY=your-gemini-api-key-here
JWT_ACCESS_SECRET=any-random-string-here
JWT_REFRESH_SECRET=another-random-string-here
```

The JWT secrets can be any random string. You can generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Run database migrations

This creates all the necessary tables in your database:

```bash
npm run db:migrate
```

You should see output like:

```
Migrated: 001_create_users.sql
Migrated: 002_create_mood_entries.sql
...
All migrations complete
```

### 6. Start the development servers

```bash
npm run dev
```

This starts both the backend (port 3001) and frontend (port 5173) at the same time.

Open your browser and go to: **http://localhost:5173**

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server in dev mode |
| `npm run dev:client` | Start only the frontend |
| `npm run dev:server` | Start only the backend |
| `npm run build` | Build both client and server for production |
| `npm run db:migrate` | Run database migrations |

## Project Structure

```
testingone/
├── client/          # React frontend
│   └── src/
│       ├── pages/          # Page components (Dashboard, Chat, Check-in, etc.)
│       ├── components/     # Reusable UI and layout components
│       ├── context/        # React Context for auth state
│       ├── config/         # API client, constants, emotions list
│       └── types/          # TypeScript type definitions
├── server/          # Express backend
│   └── src/
│       ├── routes/         # API endpoint definitions
│       ├── controllers/    # Request handlers
│       ├── services/       # Business logic (auth, AI chat, crisis detection)
│       ├── repositories/   # Database queries
│       ├── middleware/      # Auth, error handling, rate limiting
│       ├── database/       # Migration runner and SQL migration files
│       ├── prompts/        # AI system prompt for Luna
│       └── config/         # Database, Gemini, environment config
└── .env             # Environment variables (not committed to git)
```

## Features

- **Daily Mood Check-ins** - Rate your mood 1-10, select emotions, add notes
- **Luna AI Chat** - Talk to an AI companion powered by Google Gemini
- **Journal** - Write daily entries with optional image uploads
- **Dashboard** - View mood trends, emotion breakdowns, streak tracking, and a daily affirmation
- **Crisis Detection** - Automatically detects concerning language and shows crisis resources
- **Data Export** - Download your data as CSV or generate a therapist summary
- **Anonymous Mode** - Use the app without creating an account
