# Pathfinder (demo)

## What this is
A mobile-first PWA that helps a learner choose a learning path.
The learner enters a goal, a level, their reason ("why") and constraints,
and gets 3-5 ranked courses from a curated catalog, with reasons.
This is a one-day demo: no backend, no login, no LLM calls.

## Stack
React + Vite + TypeScript, Tailwind CSS, vite-plugin-pwa, Vitest.
Data: src/data/catalog.json. Saved state: localStorage.
i18n: src/i18n/en.json and src/i18n/fr.json. No hard-coded UI strings.

## Catalog schema (src/data/catalog.json)
{ id, title, provider, url, goals: string[], level: "new"|"basics"|"intermediate",
  hours: number, cost: "free"|"paid", priceNote?: string,
  dataWeight: "low"|"medium"|"high", language: "en"|"fr",
  format: "video"|"text"|"interactive",
  sourceNote: string,            // what was checked on the course page
  lastVerified: "YYYY-MM-DD" | null }  // null until a human verifies it

## Learner profile
{ goal, level, why, hoursPerWeek, device: "phone"|"laptop",
  data: "very_limited"|"some"|"plenty", budget: "free_only"|"can_pay", language }

## Scoring (src/lib/score.ts), total out of 100
goal match 35, level match 20 (one level away = half), time fit 15,
data fit 10, cost fit 10, language 10.
Return the score plus a list of human-readable reasons.
Never hide a course; low scorers get a "may be harder for you" note.
Path = top 3-5 by score, then ordered by level (new first).

## Rules
- Never invent courses or URLs. Only use details stated on the course page.
- Never guess prices, hours or levels; leave the field empty and add a TODO.
- lastVerified stays null until a human has checked the entry.
- Mobile-first, works at 360px width, large tap targets.
- Text-first, no heavy images; the app must work offline after first load.
- Keep components small; write tests for score.ts.
- The app only displays catalog entries where lastVerified is not null.

## Reference
docs/pathfinder-plan.md is the full project plan and roadmap, for context only.
Build only what this file and the current prompt ask for. Ignore Phases 1-4.