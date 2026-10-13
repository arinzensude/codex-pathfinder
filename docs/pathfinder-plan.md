# Learning Advisory & Companion — Project & Demo Plan

Oct 12, 2026 · Arinze Nsude

## Overview

The demo is one feature: the **Pathfinder advisor**. A learner states a goal, a reason, and their constraints, and gets a ranked, explained learning path that works offline. Everything else (progress tracking, nudges, the browser extension, the Android app, the ML models) is presented in the video as the roadmap.

The product is a Learning Advisory and Companion that helps learners choose the right course or learning pathway and see the journey through. It is a cross-track entry: Access & Discovery, Engagement, and Guidance & Pathways.

Why the advisor is the demo feature:

- It is the first step of the learner journey. Every later feature depends on the goal, the "why" and the path it captures.
- It runs entirely in the browser from a curated catalog file, with no backend, no login and no LLM, so it can be built and deployed in one day.
- It shows four of the brief's constraints on screen: credible, traceable sources; low data use; offline access; and a second language.
- It sets up the roadmap story: the transparent scoring shown in the demo is what the ML models replace once real data exists.

## Full project plan

The product is built in five phases, from the one-day demo to a multilingual, ML-driven platform. Each phase adds a layer to the same learner journey: choose a path, track progress, get nudged, and learn from outcomes.

**Roadmap at a glance:**

1. **Phase 0: Demo (1 day)** — Pathfinder advisor PWA: goal, why and constraints to an explained path, offline, English and French
2. **Phase 1: MVP companion** — Accounts, one-tap and screenshot check-ins, nudges by email, WhatsApp and SMS, outcome follow-ups
3. **Phase 2: Tracking across platforms and devices** — Browser extension on learning sites, Android app with Expo, SMS-only access for basic phones
4. **Phase 3: Machine learning** — Completion and dropout models; a recommender that learns from completions and outcomes
5. **Phase 4: Scale and inclusion** — More languages, voice and accessibility, local credentials and opportunities, partnerships

Only Phase 0 is built for the capstone; Phases 1–4 are the roadmap shown in the video.

### Phase 0: Demo (1 day)

- Pathfinder advisor as an installable mobile web app (PWA).
- Curated catalog of 20–25 verified courses in one domain.
- Transparent, rule-based fit scoring with a reason shown for each recommendation.
- Path and "why" saved on the device and available offline.
- English and French interface.

### Phase 1: MVP companion

- **Backend:** FastAPI with PostgreSQL; accounts by email or phone magic link.
- **Progress check-ins:** one-tap check-ins, plus screenshot uploads read with OCR (Tesseract), with a vision model only as a fallback.
- **Nudges:** email, WhatsApp and SMS templates that quote the learner's "why" and their next step. No LLM needed.
- **Catalog admin:** a simple tool to add, verify and retire courses, with source links and a last-checked date.
- **Outcome follow-ups:** short check-ins at about 30 and 90 days after completion (job, project, exam, certificate, or nothing).

### Phase 2: Tracking across platforms and devices

- **Browser extension (Chrome, then Firefox and Edge):** tracks progress automatically on an allowlist of learning sites (YouTube, Coursera, freeCodeCamp, Udemy). Processing happens on the device; only progress events are sent.
- **Android app:** built with React Native and Expo, reusing the PWA's logic. Optional app-usage time (Android's usage-stats permission) as an extra progress signal.
- **Basic-phone access:** SMS-only check-ins and nudges; USSD as a later option.

### Phase 3: Machine learning

- **Completion prediction:** gradient-boosted model (LightGBM) on platform-agnostic features such as days active in week 1, time to first activity, longest gap, progress per week and completion by day 14. Pretrained on OULAD and XuetangX mapped into the same features, then retrained and recalibrated on the platform's own data.
- **Dropout timing:** survival model to predict when a learner is likely to slip, so nudges arrive before that point.
- **Recommendation:** content-based ranking first, then collaborative filtering, then learning-to-rank optimised for completion and outcomes, not clicks.
- **Outcome insights:** per-course completion and outcome rates, published back into recommendations.
- **Rule:** predictions decide how much support a learner gets. They never hide or block a course.

### Phase 4: Scale and inclusion

- More languages: Portuguese, Arabic (right-to-left), Hausa, Yoruba, Igbo and Swahili.
- Low-literacy support: voice input and read-aloud, icon-led navigation.
- Accessibility: screen-reader support and high-contrast mode.
- Local opportunities: link paths to credentials, institutions, jobs and scholarships by country.
- Partnerships with schools, bootcamps and NGOs to supply learners and verified outcome data.

### Cross-cutting requirements

| Requirement | How it is met |
| --- | --- |
| Credibility | Curated catalog only; every course shows its source and a last-verified date |
| Low bandwidth | Data weight shown per course; offline path; text-first pages |
| Privacy | Data minimisation, explicit consent, on-device processing where possible; compliance with Nigeria's Data Protection Act 2023 and equivalents |
| Inclusion | Predictions adjust support, never access; no profile is required to get a path |
| Multilingual | Interface strings in translation files from day one |
| Minimal LLM use | Used only for one-off catalog tagging and OCR fallback, with results cached |

## Demo plan

The demo is a frontend-only PWA: one user flow, one catalog file, no backend, deployed to Vercel and shown on an Android phone. Budget about 12 hours: 8 to build, 3 for the video, 1 buffer.

### Demo flow (6 screens)

1. **Welcome:** one-line pitch and an English/French toggle.
2. **Goal:** pick a goal from the catalog's goals and a current level (new, some basics, intermediate).
3. **Why:** a free-text box: "Why do you want to learn this?" This is the anchor for every later nudge.
4. **Constraints:** hours per week, device (phone or laptop), data (very limited, some, plenty), budget (free only or can pay).
5. **Your path:** 3–5 ordered courses. The learner's "why" is pinned at the top. Each card shows title, provider, source link, duration, cost, data weight, language, last-verified date, and "Why this fits you" reasons.
6. **Saved:** "Saved on this device, works offline," plus a clearly labelled preview of the next feature: a sample nudge that quotes the learner's "why."

### Scoring (rule-based, explainable)

Each course gets a fit score out of 100:

| Factor | Weight | Logic |
| --- | --- | --- |
| Goal match | 35 | Course tags overlap the chosen goal |
| Level match | 20 | Same level scores full; one level away scores half |
| Time fit | 15 | Course hours fit the learner's weekly hours within a target of about 8 weeks |
| Data fit | 10 | Low data weight scores full for "very limited" data |
| Cost fit | 10 | Free scores full for "free only" |
| Language | 10 | Course in the interface language scores full |

Courses that fit poorly are shown lower with a "may be harder for you" note, never hidden. The path orders the top courses by level (beginner first).

### Stack

- React, Vite and TypeScript, with Tailwind for styling.
- `vite-plugin-pwa` for install and offline caching.
- `catalog.json` as the only data source; `localStorage` for the saved path.
- Simple JSON translation files for English and French.
- Vitest unit tests for the scoring function.
- Vercel for hosting.

### Catalog rule

Codex drafts the catalog from a web search (prompt 2), using only details stated on each course page, and a script checks every link. You then open each remaining link, confirm the title, cost, level, language and data weight, and set `lastVerified`. Only verified entries go into the demo: a broken or made-up link undermines the credibility claim. Data weight rule: text or interactive courses are low, short videos are medium, long video series are high.

### One-day schedule

| Time | You | Codex |
| --- | --- | --- |
| 0:00–0:45 | Pick the domain; write `AGENTS.md` | Scaffold the app (prompt 1), then draft the catalog (prompt 2) |
| 0:45–2:30 | Verify the drafted catalog | Build onboarding screens (prompt 3) |
| 2:30–4:00 | Review the scoring logic and tests | Build the scoring engine with tests (prompt 4) |
| 4:00–5:30 | Test the flow on your phone | Build the path screen and saved screen (prompt 5) |
| 5:30–6:30 | Translate the strings to French | Add PWA offline support and the language toggle (prompt 6) |
| 6:30–7:00 | Deploy; test on Android in airplane mode | Fix deploy issues |
| 7:00–8:00 | Prepare the demo persona and inputs | Polish and fix bugs (prompt 7) |
| 8:00–11:00 | Build the roadmap slide; record and edit the video | None |
| 11:00–12:00 | Buffer | None |

### Done means

- [ ] The full flow works on an Android phone from the deployed URL
- [ ] The saved path opens in airplane mode
- [ ] Every course link opens a real page
- [ ] The French toggle switches every screen
- [ ] Scoring tests pass

## Codex playbook

Put `AGENTS.md` in the repo root first, then run the seven prompts in order in the Codex desktop app, one at a time. Review and run the app after each prompt before starting the next. Prompt 2 needs web search turned on in Codex.

### AGENTS.md

```markdown
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
Never hide a course; low scorers get a "may be harder for you" note.
Path = top 3-5 by score, then ordered by level (new first).

## Rules
- Never invent courses or URLs. Only use details stated on the course page.
- Never guess prices, hours or levels; set the field to null and list it in docs/catalog-todo.md.
- Goals use only: python-programming, machine-learning, generative-ai-and-prompt-engineering, aws-cloud, data-analysis.
- The app only displays catalog entries where lastVerified is not null.
- Scoring treats a null field as no points for that factor, with a reason saying the detail is unknown.
- lastVerified stays null until a human has checked the entry.
- Mobile-first, works at 360px width, large tap targets.
- Text-first, no heavy images; the app must work offline after first load.
- Keep components small; write tests for score.ts.
```

### Prompts

1. **Scaffold:** "Read AGENTS.md. Scaffold the project with React, Vite, TypeScript, Tailwind, vite-plugin-pwa and Vitest. Create the folder structure, an empty catalog.json with two placeholder entries matching the schema, empty en/fr translation files, and a simple router for six screens. Make `npm run dev` and `npm test` work."
2. **Catalog draft (web search on):** "Search the web for about 100 free or low-cost courses across these goals, roughly 20 per goal, working through one goal at a time and saving entries to src/data/catalog.json after each goal: python-programming, machine-learning, generative-ai-and-prompt-engineering, aws-cloud, data-analysis. Use only these exact strings in goals; a course may have more than one. Cover levels from new to intermediate for each goal. Prefer credible providers such as freeCodeCamp, Kaggle Learn, Google, Microsoft Learn, AWS Skill Builder, AWS Educate, DeepLearning.AI short courses, fast.ai, Hugging Face Learn, Coursera (free audit), edX, Khan Academy, Alison, and university or official YouTube channels. Include Udemy courses, both free and paid, but only those rated 4.5 or higher with at least 1,000 ratings; record the rating and number of ratings in sourceNote. For paid Udemy courses set cost to 'paid' and priceNote to 'Price varies; frequent sales' rather than a fixed price. Include at least 2 French courses per goal where they exist; if fewer exist, say so instead of padding. Replace the placeholders, follow the schema in AGENTS.md, and use only details stated on each course page. Fill sourceNote and set lastVerified to null. Never guess prices, hours or levels: set the field to null and list the course id and missing field in docs/catalog-todo.md (JSON cannot hold comments). Then write scripts/check-links.ts, run it, and report failures; report 403 responses separately as 'blocked, check manually' rather than as broken. Finish with a summary table of counts per goal, level and language."
3. **Onboarding:** "Build screens 1–4 (Welcome with language toggle, Goal and level, Why, Constraints) as a step-by-step flow with a progress bar and back buttons. Build the learner profile in one state object. Goals come from the unique `goals` values in catalog.json. All strings come from the i18n files."
4. **Scoring:** "Implement src/lib/score.ts exactly as specified in AGENTS.md. Export `scoreCourse(course, profile)` returning `{score, reasons}` and `buildPath(catalog, profile)` returning 3–5 courses. Write Vitest tests covering each factor, a profile with very limited data and free-only budget, and the case where no course fits well."
5. **Path screen:** "Build screen 5: the learner's 'why' pinned at the top, then the path as numbered cards showing title, provider, source link (opens in a new tab), hours, cost, data weight, language, last verified date and the reasons from score.ts. Build screen 6: save the profile and path to localStorage, show 'Saved on this device, works offline', and a preview card labelled 'Coming next' showing a sample nudge that quotes the learner's why and names step 1. On app load, if a saved path exists, open it directly."
6. **Offline and French:** "Configure vite-plugin-pwa so the app installs on Android and works fully offline after first load, including catalog.json. Add a manifest with name, icons and theme colour. Make sure every screen switches language with the toggle and the choice is saved."
7. **Polish:** "Review the app on a 360px viewport. Fix layout issues, add focus states and aria labels, make tap targets at least 44px, and add a 'Start over' button. Run the tests and fix any failures."

## 5-minute video script

Spend about 2 of the 5 minutes on the live demo and about 1.5 on the roadmap. Record the demo on your phone screen and keep the roadmap to one slide.

| Time | Section | What to show and say |
| --- | --- | --- |
| 0:00–0:40 | The problem | Your story: stalling on too many options, and dropping courses you started. Many learners across Africa face the same problem, made worse by scattered resources and limited data. |
| 0:40–1:00 | The idea | A Learning Advisory and Companion: choose the right path, then see it through. A cross-track entry. Today's demo is the first step, the advisor. |
| 1:00–3:00 | Live demo | Walk through one persona: goal, level, "why," very limited data, free only. Show the path cards, the reasons, the source links and the pinned "why." Switch to French. Turn on airplane mode and reopen the saved path. |
| 3:00–4:20 | Roadmap | One slide with the four next phases: progress check-ins and nudges that quote the learner's "why"; the browser extension and Android app; ML that learns which courses people finish and what outcomes they get; more languages and local opportunities. |
| 4:20–5:00 | Why it matters | How the constraints are met: credible sources, low data, offline, multilingual, privacy, and predictions that add support rather than exclude. Close on finishing what you start. |

A demo persona to use: "Amina, a beginner in Kano who wants to learn data analysis to get an entry-level job, has 4 hours a week, very limited data and needs free courses." Use the same inputs in every take so the output stays consistent.
