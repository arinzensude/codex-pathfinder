# Pathfinder scaffold

Requires Node.js 22.12+ or 24+ and npm (verified with Node.js 24).

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
npm run catalog:report
npm run check-links
```

`npm test` runs once; `npm run test:watch` watches for changes.

## Structure

- `src/components/`: shared scaffold screen
- `src/lib/`: six route definitions and tests; future scoring and storage logic
- `src/types/`: course, draft course, and learner profile types
- `src/data/catalog.json`: 100 researched draft entries, 20 per goal
- `src/i18n/`: empty English/French dictionaries and translation helper
- `public/`: future PWA icons and static assets
- `scripts/`: catalog validation/report generation and HTTP link checker
- `docs/catalog-summary.md`: counts, evidence limitations, normalization policy
- `docs/catalog-todo.md`: all missing hours, cost, and level fields
- `docs/catalog-link-report.md`: HTTP outcomes including separately reported 403s

Hash routes: `#/`, `#/goal`, `#/why`, `#/constraints`, `#/path`, `#/saved`.
Numbered navigation opens each screen. Screens deliberately contain no copy while
translation files are empty. Add `navigation.label` and `screens.<id>.title` keys
when implementing the UI.

Unknown hours, cost, and level values are `null`, as specified in AGENTS.md.
`lastVerified` remains null until human verification. Research and an HTTP 200
response do not verify a record; future recommendation UI must display only
records with a non-null human review date. Course sources and access limitations
are recorded in each sourceNote. Catalog scripts never set human review dates.

The production build generates a service worker that caches the app shell.
Use `npm run preview` to inspect it; dev mode does not register a service worker.
Install icons, scoring, learner forms, translations, and saved paths are future work.
