# JobPilot

AI job intelligence and recruitment platform: a clickable demo with a public site, a candidate area and an admin panel.

Built with Next.js 16, React 19, Tailwind CSS 4 and shadcn/ui.

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Area | Start here |
| --- | --- |
| Public site | `/` |
| Candidate area | `/login`, then `/dashboard` |
| Admin panel | `/admin/login`, then `/admin` |

## Demo data

This is a UI demo. There is no backend yet:

- Sample data lives in `lib/` (for example `lib/mock-data.ts` and `lib/candidate-detail.ts`).
- Anything you change in the app (uploaded CVs, selected jobs, statuses, requests) is saved in the browser's local storage, so it stays on that browser only.
- Searches, recruiter lookups, emails and document drafts are simulated.

## Deploy on Vercel

No environment variables or extra settings are needed.

1. Push this repository to GitHub, GitLab or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected defaults: framework **Next.js**, build command `next build`, output handled by Vercel.
4. Click **Deploy**.

To check a production build locally first:

```bash
npm run build
npm start
```

## Project rules

See `CLAUDE.md`: shadcn/ui components only, the theme stays as it is, arrow functions, and Tailwind classes for styling.
