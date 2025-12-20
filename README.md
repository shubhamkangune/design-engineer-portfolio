# Mechanical Portfolio — Shubham Kangune

Designed & developed by Shubham Kangune.

Professional portfolio showcasing mechanical design work, CAD models, tool & die design, and manufacturing process experience. This project is a self-developed static React + Vite application with a lightweight Express backend for handling contact form submissions.

Key points
- **Author:** Shubham Kangune — Designed & Developed by the author.
- **Tech stack:** React (client), Vite (build), TypeScript, Express (server), Tailwind CSS.
- **Email:** Contact form forwards messages to `CONTACT_EMAIL` configured via environment variables.

Quick start (development)

1. Copy the example environment file and fill in secrets:

```bash
cp .env.example .env
# Edit .env: set SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_EMAIL
```

2. Install dependencies and run locally:

```bash
npm install
npm run dev
```

Deployment
- This project is suitable for deployment on Vercel, Netlify, or GitHub Pages (static client) with the Express API hosted on Vercel serverless functions or a small Node host.
- For Vercel: ensure `VERCEL_URL` or `DEPLOYMENT_URL` is set (the included meta image plugin will use these env vars).

Environment variables
- `PORT` (server port)
- `NODE_ENV` (development|production)
- `CONTACT_EMAIL` (email that receives contact form submissions)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE` — SMTP credentials (use an app password for Gmail with 2FA)

Notes
- All Replit-specific plugins and comments were removed. If you see any remaining references after pulling changes, run `git grep replit` to locate them.
- To regenerate a clean lockfile:

```bash
rm -f package-lock.json
npm install
```

If you want, I can also:
- run `npm install` and regenerate `package-lock.json` here, or
- add a small CI workflow and Vercel/GitHub Pages deployment instructions.
