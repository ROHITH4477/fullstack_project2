# StayVista Full Stack App

This repository contains:

- A Vite + React frontend in the repo root
- A Spring Boot backend in [backend](c:/Users/rohit/Music/fullstack-project5/backend)

## Local development

Frontend:

```sh
npm install
npm run dev
```

Backend:

```sh
cd backend
mvn spring-boot:run
```

Frontend env example:

```sh
VITE_API_BASE_URL=http://localhost:2026
```

Backend env example:

See [backend/.env.example](c:/Users/rohit/Music/fullstack-project5/backend/.env.example).

## Google OAuth

Google sign-in is handled by the backend OAuth flow.

Add these redirect URIs in Google Cloud Console:

- `http://localhost:2026/login/oauth2/code/google`
- `https://<your-render-backend>.onrender.com/login/oauth2/code/google`

Set these backend env vars:

```sh
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
APP_FRONTEND_URL=http://localhost:5173
```

For production, set `APP_FRONTEND_URL` to your Render frontend URL.

## Render deployment

This repo now includes:

- [render.yaml](c:/Users/rohit/Music/fullstack-project5/render.yaml)
- [backend/Dockerfile](c:/Users/rohit/Music/fullstack-project5/backend/Dockerfile)

Recommended deployment flow:

1. Push this repo to GitHub.
2. In Render, create a Blueprint from the repo.
3. Create or connect a PostgreSQL database.
4. Fill in the prompted env vars in Render.
5. Deploy the backend first, then set the frontend `VITE_API_BASE_URL` to that backend URL.
6. Set `APP_FRONTEND_URL` on the backend to your frontend URL.

Important Render env vars:

- Frontend: `VITE_API_BASE_URL`
- Backend: `APP_FRONTEND_URL`
- Backend: `DB_URL`
- Backend: `DB_USERNAME`
- Backend: `DB_PASSWORD`
- Backend: `DB_DRIVER=org.postgresql.Driver`
- Backend: `GOOGLE_CLIENT_ID`
- Backend: `GOOGLE_CLIENT_SECRET`
- Backend: `MAIL_USERNAME`
- Backend: `MAIL_PASSWORD`

## Security note

Do not commit real secrets to this repository. The tracked env example files now use placeholders only. Rotate any credentials that were previously exposed before pushing to GitHub.
