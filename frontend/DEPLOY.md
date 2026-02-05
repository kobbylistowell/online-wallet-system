# Deploying the frontend

You can host the frontend on any static host. Steps below.

## 1. Set the production API URL

Create a `.env` or `.env.production` in the `frontend` folder:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

Replace with your real Django backend URL (with `/api` at the end).  
This is baked in at **build time** (Vite only reads `VITE_*` env vars during `npm run build`).

## 2. Build

```bash
cd frontend
npm ci
npm run build
```

Output is in `dist/`. That folder is what you deploy.

## 3. Host the `dist/` folder

### Vercel (recommended)

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → Import the repo.
3. **Root Directory:** set to `frontend`.
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Environment variables:** add `VITE_API_URL` = `https://your-api.com/api`
7. Deploy. Vercel will also handle client-side routing (React Router).

### Netlify

1. Push to GitHub, then [netlify.com](https://netlify.com) → Add new site → Import from Git.
2. **Base directory:** `frontend`
3. **Build command:** `npm run build`
4. **Publish directory:** `frontend/dist`
5. **Environment variables:** `VITE_API_URL` = `https://your-api.com/api`
6. Deploy. Add a redirect for SPA: `/* /index.html 200` (in `frontend/public/_redirects` or Netlify UI).

### Other static hosts

Upload the contents of `dist/` to your host. Ensure:

- The API is reachable from the browser (CORS and `CSRF_TRUSTED_ORIGINS` include your frontend URL).
- All routes (e.g. `/login`, `/dashboard`) serve `index.html` (SPA fallback).

## Backend checklist when frontend is hosted

On your Django backend you must:

1. **ALLOWED_HOSTS** – include your frontend/backend domains.
2. **CORS_ALLOWED_ORIGINS** – include the frontend URL, e.g. `https://your-app.vercel.app`.
3. **CSRF_TRUSTED_ORIGINS** – same frontend URL, e.g. `https://your-app.vercel.app`.
4. Use HTTPS in production.

Then the frontend can log in and call the API from the hosted URL.
