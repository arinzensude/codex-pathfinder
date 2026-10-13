import { readFile, writeFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const catalog = JSON.parse(await readFile(new URL('src/data/catalog.json', root), 'utf8')) as Array<Record<string, unknown>>
const goals = ['python-programming', 'machine-learning', 'generative-ai-and-prompt-engineering', 'aws-cloud', 'data-analysis']
const levels = ['new', 'basics', 'intermediate']
const ids = new Set<string>()
const required = ['id', 'title', 'provider', 'url', 'goals', 'level', 'hours', 'cost', 'dataWeight', 'language', 'format', 'sourceNote', 'lastVerified']
for (const course of catalog) {
  const fail = (message: string): never => { throw new Error(`${course.id}: ${message}`) }
  for (const field of required) if (!(field in course)) fail(`missing ${field}`)
  for (const field of ['id', 'title', 'provider', 'url', 'sourceNote']) if (typeof course[field] !== 'string' || !String(course[field]).trim()) fail(`empty ${field}`)
  const id = String(course.id)
  if (ids.has(id)) fail('duplicate id')
  ids.add(id)
  const url = new URL(String(course.url))
  if (url.protocol !== 'https:') fail('course URL must use HTTPS')
  if (!Array.isArray(course.goals) || !course.goals.length || course.goals.some(goal => !goals.includes(String(goal)))) fail('invalid goal')
  if (new Set(course.goals as string[]).size !== (course.goals as string[]).length) fail('duplicate goal tag')
  if (course.level !== null && !levels.includes(String(course.level))) fail('invalid level')
  if (course.hours !== null && (typeof course.hours !== 'number' || !Number.isFinite(course.hours) || course.hours <= 0)) fail('invalid hours')
  if (course.cost !== null && !['free', 'paid'].includes(String(course.cost))) fail('invalid cost')
  if (!['low', 'medium', 'high'].includes(String(course.dataWeight))) fail('invalid dataWeight')
  if (!['en', 'fr'].includes(String(course.language))) fail('invalid language')
  if (!['text', 'video', 'interactive'].includes(String(course.format))) fail('invalid format')
  if (course.lastVerified !== null && (typeof course.lastVerified !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(course.lastVerified))) fail('invalid lastVerified')
  if (url.hostname.endsWith('udemy.com')) {
    const rating = String(course.sourceNote).match(/rating (\d\.\d)\/5 from ([\d,]+) ratings/)
    if (!rating || Number(rating[1]) < 4.5 || Number(rating[2]!.replaceAll(',', '')) < 1000) fail('Udemy rating/count does not meet threshold')
    if (course.cost === 'paid' && course.priceNote !== 'Price varies; frequent sales') fail('paid Udemy priceNote must use requested wording')
  }
}

const table = ['| Goal | Total | New | Basics | Intermediate | Unknown level | English | French |', '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |']
const joint = ['| Goal | Language | New | Basics | Intermediate | Unknown level | Total |', '| --- | --- | ---: | ---: | ---: | ---: | ---: |']
for (const goal of goals) {
  const courses = catalog.filter(c => (c.goals as string[]).includes(goal))
  const count = (field: string, value: unknown) => courses.filter(c => c[field] === value).length
  if (!courses.some(c => c.level === 'new') || !courses.some(c => c.level === 'intermediate')) throw new Error(`${goal}: missing beginner/intermediate coverage`)
  table.push(`| ${goal} | ${courses.length} | ${count('level', 'new')} | ${count('level', 'basics')} | ${count('level', 'intermediate')} | ${count('level', null)} | ${count('language', 'en')} | ${count('language', 'fr')} |`)
  for (const language of ['en', 'fr']) {
    const subset = courses.filter(c => c.language === language)
    joint.push(`| ${goal} | ${language} | ${levels.map(level => subset.filter(c => c.level === level).length).join(' | ')} | ${subset.filter(c => c.level === null).length} | ${subset.length} |`)
  }
}
const unknown = catalog.filter(c => ['level', 'hours', 'cost'].some(field => c[field] === null))
const counts = ['free', 'paid', null].map(cost => `${cost ?? 'unknown cost'}: ${catalog.filter(c => c.cost === cost).length}`).join('; ')
const report = ['# Catalog research summary', '', 'Research date: 2026-10-13. All records are drafts; web research and HTTP checks are not human verification.', '',
  `${catalog.length} unique course/learning-path/module entries. ${counts}. ${unknown.length} entries have at least one unknown level, hours, or cost field.`, '',
  ...table, '', '## Level and language together', '', ...joint, '',
  'Counts are goal memberships. All current entries have one goal tag. AWS Educate has five distinct courses behind one shared registration/course-selection URL; the catalog therefore has 96 unique URLs.', '',
  '## Evidence and access limitations', '',
  '- Every entry retains its course URL and a sourceNote explaining the page evidence or the limitations of indexed retrieval. Selected supporting excerpts are saved in catalog-page-evidence.json.',
  '- A sourceNote may cite an official course listing when a course page requires JavaScript or sign-in. Resolve course-specific details before human verification; do not treat a reachable launcher as confirmed enrollment.',
  '- Coursera enrollment or trial wording does not establish free audit access. Unknown access costs remain null; check individual enrollment options and financial aid eligibility. No fixed Udemy prices are stored.',
  '- Udemy course ratings (not instructor ratings or student counts) were checked against 4.5/5 and 1,000 ratings. Recheck them before verifying a record; they change over time.',
  '- DeepLearning.AI pages state free access for a limited beta period; optional PRO assessments/accomplishments are separate. Cloud services, software licenses, hardware, exam fees and certificates may cost extra.',
  '- French coverage reaches at least two distinct courses for every goal. French website navigation and automatic subtitles alone were not used as proof of French teaching. Inria scikit-learn is English-only despite bilingual metadata. French Udemy AWS candidates checked did not qualify.',
  '- Legacy freeCodeCamp certifications, the 2020 AWS Developer video, the 2016 MIT course and the 2020 Udemy data-science course need relevance/tool-version review.', '',
  '## Normalization', '',
  '- new corresponds to explicit beginner/Débutant/Facile or explicit no-experience audience statements. basics is used only where the page describes an existing foundation/prerequisite (recorded in sourceNote). intermediate corresponds to Intermediate/Moyenne or an explicitly intermediate prerequisite. An advanced title alone is not mapped to intermediate.',
  '- Durations are numeric hours. Minutes are divided by 60; explicitly stated weeks × hours/week are multiplied. Range estimates, ECTS credits, and days without hourly effort are left null. Original figures are retained in sourceNote.',
  '- dataWeight is a catalog policy derived from observed delivery format, not measured bytes or a provider claim: text/interactive lessons are low; videos up to two stated hours are medium; longer or unknown-length video courses are high. AWS Cloud Quest is high because it is a 3D game. Optional videos, datasets and notebook runtimes can still require substantial bandwidth.', '',
  'Run npm run catalog:report to validate and regenerate this summary and catalog-todo.md. Run npm run check-links to regenerate the HTTP report. Neither command sets lastVerified.', '']
await writeFile(new URL('docs/catalog-summary.md', root), report.join('\n'))
const todo = ['# Catalog TODO', '', 'Research date: 2026-10-13. Never fill these gaps by estimating. Use the course page; keep lastVerified null until a human confirms the record.', '',
  `Unknown fields: level ${catalog.filter(c => c.level === null).length}; hours ${catalog.filter(c => c.hours === null).length}; cost ${catalog.filter(c => c.cost === null).length}.`, '',
  '| ID | Course | Missing fields |', '| --- | --- | --- |',
  ...unknown.map(c => `| ${c.id} | [${c.title}](${c.url}) | ${['level', 'hours', 'cost'].filter(field => c[field] === null).join(', ')} |`), '',
  '## Human review before verification', '',
  '- Open each course, confirm teaching language, title/provider, access conditions, learner prerequisites, total effort and delivery format. Check that free/low-cost access remains available in the learner’s region.',
  '- Resolve the five AWS Educate course URLs after sign-in. Review the Cloud Essentials learning-plan and Cloud Quest launchers; a shared page may return HTTP 200 while the course itself is unavailable.',
  '- Check every Udemy 403 manually; confirm current course rating and rating count. Unknown-priced Udemy records retain cost null. If paid access is confirmed, use cost paid and priceNote "Price varies; frequent sales".',
  '- Check current Coursera audit/no-certificate access or financial aid; never assume that "Enroll for free" means free full-course access.',
  '- Review legacy course versions and library dependencies noted in sourceNote.',
  '- When a human completes review, set lastVerified to that review date. The app must only display human-verified records, as required by AGENTS.md.', '']
await writeFile(new URL('docs/catalog-todo.md', root), todo.join('\n'))
console.log(`Validated ${catalog.length} records; ${counts}.`)
console.log(table.join('\n'))
