# Geocutters

Find mobile hairdressers near you.

## Setup

```bash
cd geocutters
npm install
```

## Run Locally

**Terminal 1 - API:**
```bash
cd apps/api
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
npm run dev
```

## Access

- Frontend: http://localhost:3000
- API: http://localhost:3001

## Deployment

- **Frontend (`apps/web`)** is hosted on Vercel.
- **API (`apps/api`)** is hosted as a web service on Render.
- **PostgreSQL database and user authentication** are hosted in the same Supabase project. Prisma manages the app tables in the database.
- The frontend forwards `/api/*` requests to the Render API using the `API_URL` environment variable in Vercel.

Configure deployment environment variables in Vercel and Render rather than committing credentials to the repository. Keep database credentials and the Supabase service-role key on Render only.