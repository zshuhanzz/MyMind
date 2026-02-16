# My Mind

A mental wellness web app where users can check in with their mood daily, talk to an AI friend, write journal entries, and track their emotional patterns over time.

## Tech Stack

- **Frontend:** React , TypeScript, Vite, Tailwind, Recharts
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **AI:** Google Gemini API 


### 1. Clone the repository

```bash
cd "desired file location"
git clone "repo url">
```

### 2. Install dependencies

Make sure you have nodejs installed. Run this at the root:

```bash
npm install
```

This installs dependencies for both the client and server (npm workspaces).

### 3. Set up the database with your PostgreSQL (or you can use pgadmin like me)

```sql
CREATE DATABASE "db name";
```

### 4. Change .env file

Copy the env file and fill in your values:

```
DATABASE_URL= "postgresql://postgres(or a username if you made one):password(or pass for user if you made one)@localhost:5432/dbname"
GEMINI_API_KEY= "your gemini api key"
```


### 5. Run database migrations (creates necessary tables)

```bash
npm run db:migrate
```

### 6. Run the local server

```bash
npm run dev
```

Open your browser and go to: **http://localhost:5173**
And also, you don't need to run npm install and npm run db:migrate again after the first time.


