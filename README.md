# Pathfinder scaffold

Requires Node.js 22.12+ or 24+ and npm (verified with Node.js 24).

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
npm run test:pwa
npm run catalog:report
npm run check-links
```

`npm test` runs once; `npm run test:watch` watches for changes.

## Structure

- `src/components/`: onboarding, course cards, path and saved screens
- `src/lib/`: route definitions, scoring, duration formatting, storage and tests
- `src/types/`: course, draft course, and learner profile types
- `src/data/catalog.json`: 100 researched draft entries, 20 per goal
- `src/i18n/`: English/French UI dictionaries and translation helper
- `public/`: install icons, maskable icon and favicon
- `scripts/`: catalog validation/report generation and HTTP link checker
- `docs/catalog-summary.md`: counts, evidence limitations, normalization policy
- `docs/catalog-todo.md`: all missing hours, cost, and level fields
- `docs/catalog-link-report.md`: HTTP outcomes including separately reported 403s

Hash routes: `#/`, `#/goal`, `#/why`, `#/constraints`, `#/path`, `#/saved`.
Screens 1–4 form a guided flow: Welcome, Goal and level, Why, Constraints.
The language toggle updates the interface and learner language together. The
language preference (`pathfinder.language.v1`) is saved independently: switching
language saves the preference immediately, including before a path is saved. The
latest preference takes priority when restoring an older saved path. Storage
failures show a translated message while keeping the toggle usable. Answers
are held in one profile object and preserved when navigating back. Goals come
from unique catalog goal tags. Weekly hours must be between 0.5 and 168.
The path screen pins the learner's motivation above numbered course cards with
fit reasons and source links. Durations use minutes below an hour and hours plus
minutes otherwise (for example, `1 hr 30 min`). Unknown details remain labelled.

Choose **Save on this device** to store the profile and complete selected course
snapshots in localStorage (`pathfinder.savedPath.v1`) and open the saved screen.
On startup, a valid saved path opens directly. Older saves are rebuilt against
the revised level rule using their snapshots and the current offline catalog.
New saves include at most five relevant refresher snapshots and exclude
unknown-level courses, preserving recommendations offline without relying on
later catalog additions. Older saves are normalized to these rules on restore.
Malformed saved data is ignored; failed writes show an error without confirming
a save. The saved screen includes a clearly labelled sample nudge preview.
**Start over / Recommencer** clears the profile and saved path while retaining
the language preference. A failed storage reset leaves the current path intact
and displays a localized error. All six screens are checked at 360px in both
languages, including labelled controls, 44px tap targets and keyboard focus.

Unknown hours, cost, and level values are `null`, as specified in AGENTS.md.
`lastVerified` remains null until human verification. Research and an HTTP 200
response do not verify a record; future recommendation UI must display only
records with a non-null human review date. Course sources and access limitations
are recorded in each sourceNote. Catalog scripts never set human review dates.

## PWA and offline testing

The production build precaches the app shell, bundled English/French translations
and catalog, an explicit `/catalog.json` emitted from `src/data/catalog.json`, the
manifest, and install icons. No separate catalog copy is maintained. The worker
registers immediately, claims the first page after installation, and cleans up
old caches. No course-provider content is downloaded or cached.

Use `npm run build` and `npm run preview` to test the production app. Load once
online, wait for service worker installation to finish, then disconnect and
reload. All screens, scoring, language switching, saving and restored paths work
offline. Course source websites require internet access. Vite dev mode does not
register a service worker.

`npm run test:pwa` builds and runs the 360px browser test in installed Microsoft
Edge. It disables networking after the first load, reloads, fetches the cached
catalog/icons, completes all six screens in English and French, and restores a
saved path after an offline reload. Screenshots go to ignored `test-results/`.
Run `npm run icons` to regenerate the code-drawn PNG icons.

For Android installation, serve the production build over HTTPS, open it in
Chrome on the phone, then use **Install app** or **Add to Home screen** from its
menu. An ordinary HTTP LAN preview address does not provide the secure context
needed for service workers; localhost works for desktop development. Installation
on a physical Android device still needs a manual check.

Configuration follows the [vite-plugin-pwa static asset guide](https://vite-pwa-org.netlify.app/guide/static-assets).

## Scoring

`scoreCourse(course, profile)` returns a score out of 100 and reasons in the
learner's language. Weights are goal 35, level 20 (adjacent level 10), time 15,
data 10, cost 10, and language 10. Time fit uses an eight-week target. Data fit
awards full points for low weight with very limited data, low/medium with some
data, and any weight with plenty. Known free/paid costs fit a can-pay budget;
unknown level, hours, or cost earns zero for that factor. Scores below 50 receive
a caution note. Device and motivation do not add scoring factors.

`buildPath(catalog, profile)` selects the top five verified courses with a known
level at or above the learner's level by score, then orders by ascending level
and descending score within each level. Basics learners start with basics;
intermediate learners receive intermediate courses. Equal scores retain catalog
order. Fewer than three eligible entries produce a shortage message, without
padding with lower or unknown levels.

`supplementaryCourses` selects the five highest-scoring verified courses below
the learner's level that match their selected goal as **Optional refreshers**.
Both screens offer this expandable section only when courses qualify; new-level
learners have none. Unknown-level courses are excluded from recommendations but
kept in the catalog. Course cards show localized levels immediately before last
verified, and a short explanation describes the main path ordering. Saving is
supported when only refreshers are available; no step-1 nudge is shown unless
the main path contains a course.
