# IELTS Academic: Band 7 Path

A Vercel-ready, responsive Next.js study platform for a 10-week IELTS Academic Band 6 to Band 7 programme.

## What is public and what is private

This public repository contains the platform code, database migrations, release tooling, and a public sample lesson. It deliberately excludes the commercial 70-day course, answer keys, transcripts, and MP3 recordings.

Private course files live in `.private-course/`, which is Git-ignored. The publishing script uploads question payloads and MP3s into private Supabase Storage and stores answer keys/transcripts in the private schema.

## Local setup

1. Copy `.env.example` to `.env.local` and add your Supabase project URL and anonymous key.
2. Run the migration in `supabase/migrations/20260712_001_initial_schema.sql` through the Supabase SQL editor or CLI.
3. In Supabase Auth, enable email magic links and set the redirect URL to `http://localhost:3000/auth/callback` for development.
4. Run `npm run dev`.

Without Supabase variables, the public sample and visual app preview still work. Protected routes become fully enforced once the variables are set.

## Private course publishing

Create `.private-course/release.json` with `rights: "original-ielts-style"`, 70 lesson entries, 20 `isMock: true` entries, JSON question/review paths, and MP3 paths. Then run:

```bash
npm run content:validate
npm run content:publish
```

`SUPABASE_SERVICE_ROLE_KEY` is only for this local/private publishing task. Never put it in Vercel or browser code.

## Vercel and GitHub

1. Create a public GitHub repository from this folder and push `main`.
2. Import the repository in Vercel. Vercel detects Next.js automatically.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel for Production and Preview.
4. In Supabase Auth, add your Vercel domain and preview callback domains to the allowed redirect URLs.
5. Push a branch or open a pull request to receive a Vercel preview; merge to `main` for production.

Use Node 22 or newer in Vercel. The repository declares this in `package.json`.

The workflow in `.github/workflows/quality.yml` runs linting, type checks, and public release-tool validation. Vercel’s Git integration handles production and preview deployments.
