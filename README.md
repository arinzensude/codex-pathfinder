# Pathfinder scaffold

Requires Node.js 22.12+ or 24+ and npm (verified with Node.js 24).

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

`npm test` runs once; `npm run test:watch` watches for changes.

## Structure

- `src/components/`: shared scaffold screen
- `src/lib/`: six route definitions and tests; future scoring and storage logic
- `src/types/`: course, draft course, and learner profile types
- `src/data/catalog.json`: two empty draft records with TODO source notes
- `src/i18n/`: empty English/French dictionaries and translation helper
- `public/`: future PWA icons and static assets

Hash routes: `#/`, `#/goal`, `#/why`, `#/constraints`, `#/path`, `#/saved`.
Numbered navigation opens each screen. Screens deliberately contain no copy while
translation files are empty. Add `navigation.label` and `screens.<id>.title` keys
when implementing the UI.

Unknown catalog values are `null` in draft records, rather than guessed values.
They must be sourced before conversion to the strict Course type. Placeholders
are not recommendations. `lastVerified` remains null until human verification.

The production build generates a service worker that caches the app shell.
Use `npm run preview` to inspect it; dev mode does not register a service worker.
Install icons, scoring, learner forms, translations, and saved paths are future work.
