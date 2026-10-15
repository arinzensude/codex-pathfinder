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
{ id, title, provider, url, goals: string[], level: "new"|"basics"|"intermediate"|null,
  hours: number|null, cost: "free"|"paid"|null, priceNote?: string,
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
Low scores alone never exclude an otherwise eligible course; low scorers get a "may be harder for you" note.
Path = up to five verified courses whose goals include the selected goal, at or above the learner’s level, ordered from their current level upward, then by score within each level. Return fewer than three when fewer qualify; never pad with off-goal courses.
Optional refreshers must be verified, match the selected goal, and be below the learner’s level. Show only the five highest-scoring refreshers; show fewer when fewer qualify, and hide the section when none qualify.
Exclude unknown-level courses from recommendation screens and saved recommendations. Keep their catalog records unchanged for later verification.
Show the course level immediately before last verified, and explain the main path’s ordering. Apply these rules to restored saves as well as new paths.

## Rules
- Never invent courses or URLs. Only use details stated on the course page.
- Never guess prices, hours or levels; set the field to null and list it in docs/catalog-todo.md.
- Goals use only: python-programming, machine-learning, generative-ai-and-prompt-engineering, aws-cloud, data-analysis.
- The app only displays catalog entries where lastVerified is not null.
- Scoring treats a null field as no points for that factor, with a reason saying the detail is unknown.
- lastVerified is set only after the entry was checked against its live course page (AI-assisted, with human spot checks).
- Mobile-first, works at 360px width, large tap targets.
- Text-first, no heavy images; the app must work offline after first load.
- Keep components small; write tests for score.ts.

## Reference
docs/pathfinder-plan.md is the full project plan and roadmap, for context only.
Build only what this file and the current prompt ask for. Ignore Phases 1-4.
