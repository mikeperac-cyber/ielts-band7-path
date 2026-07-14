# IELTS Academic Band 9 Path

A protected 10-week IELTS Academic preparation system for learners progressing from roughly Band 7–7.5 towards Band 9 performance. Band 9 describes the expected quality of learner performance—not obscure topics, rare vocabulary, or an unofficial score claim.

## Content and audio protection

Supabase is the production source of truth for authenticated curriculum delivery. Only the landing page and public Day 1 sample are available without an account; protected routes fail closed when Supabase is unavailable.

The 70 course MP3s, `intro.mp3`, and `sample-listening.mp3` are immutable. Their SHA-256 fingerprints are recorded in `audio-checksums.sha256`. `npm run audio:verify` fails on any missing or altered recording. Listening generation scripts are deliberately disabled.

The ignored `.private-course/` package is the release and recovery source. Build it without paid AI calls:

```bash
npm run content:build-private
npm run content:validate-private
```

Apply all three SQL migrations, set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the local-only `SUPABASE_SERVICE_ROLE_KEY`, then publish with `npm run content:publish`. Publishing uploads to private Storage and downloads every MP3 again to verify its checksum. Do not remove course MP3s from `public/audio` until authenticated playback has passed in the target environment.

## Assessment scope

- Writing uses the four public IELTS criteria and returns an unofficial practice estimate.
- Speaking AI assesses only Fluency and Coherence, Lexical Resource, and Grammatical Range and Accuracy. Pronunciation is shown as “not assessed”; no official overall Speaking band is calculated.
- Short Reading and Listening drills report raw accuracy and error categories, not a band.
- Existing checkpoint days are labelled timed diagnostics. Complete full mocks remain deferred.
- Paid assessment requires authentication and is limited atomically to five Writing and five Speaking requests per learner per day.

## Development and release checks

Use Node 22 or newer.

```bash
npm run check
npm run build
npm run test:e2e
```

The check suite verifies immutable audio, all 70 CourseLessonV2 payloads, global/local day mapping, 50 regular lessons, 20 diagnostics, protected review pairs, lint, and strict TypeScript.
