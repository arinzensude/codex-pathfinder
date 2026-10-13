import { readFile, writeFile, mkdir } from 'node:fs/promises'

type CatalogEntry = { id: string; title: string; url: string }
type Outcome = 'ok' | 'blocked, check manually' | 'authentication required' | 'rate limited' | 'broken' | 'HTTP failure' | 'network error' | 'redirect, check manually'
type Result = { ids: string[]; url: string; finalUrl: string | null; status: number | null; outcome: Outcome; note: string }

const root = new URL('../', import.meta.url)
const catalog = JSON.parse(await readFile(new URL('src/data/catalog.json', root), 'utf8')) as CatalogEntry[]
const grouped = new Map<string, string[]>()
for (const course of catalog) grouped.set(course.url, [...(grouped.get(course.url) ?? []), course.id])
const jobs = [...grouped.entries()]
const results: Result[] = []
let next = 0

function classify(status: number): Outcome {
  if (status === 403) return 'blocked, check manually'
  if (status === 401) return 'authentication required'
  if (status === 429) return 'rate limited'
  if (status === 404 || status === 410) return 'broken'
  if (status >= 400) return 'HTTP failure'
  if (status >= 300) return 'redirect, check manually'
  return 'ok'
}

async function check(url: string, ids: string[]): Promise<Result> {
  try {
    const parsed = new URL(url)
    if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('URL must use HTTP(S)')
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(20_000),
      headers: { 'User-Agent': 'PathfinderCatalogLinkCheck/1.0', Accept: 'text/html,application/xhtml+xml' },
    })
    await response.body?.cancel()
    let outcome = classify(response.status)
    const destination = new URL(response.url)
    const needsReview = /showRedirectNotFoundBanner=true|\/search(?:\/|$)|\/login(?:\/|$)|\/signin(?:\/|$)/i.test(destination.pathname + destination.search)
    if (outcome === 'ok' && needsReview) outcome = 'redirect, check manually'
    return { ids, url, finalUrl: response.url, status: response.status, outcome,
      note: needsReview ? 'Redirected to search/sign-in; course availability is not confirmed.' : response.redirected ? 'Followed redirect; confirm destination still identifies the course.' : 'HTTP reachability only; a 200 response does not verify course content or enrollment.' }
  } catch (error) {
    const cause = error instanceof Error ? (error as Error & { cause?: { code?: string } }).cause : undefined
    return { ids, url, finalUrl: null, status: null, outcome: 'network error', note: `${error instanceof Error ? error.message : String(error)}${cause?.code ? ` (${cause.code})` : ''}; not evidence of a broken course.` }
  }
}

async function worker() {
  while (next < jobs.length) {
    const [url, ids] = jobs[next++]!
    const result = await check(url, ids)
    results.push(result)
    console.log(`${result.status ?? 'ERR'} | ${result.outcome} | ${ids.join(', ')} | ${url}`)
  }
}

await Promise.all(Array.from({ length: Math.min(4, jobs.length) }, worker))
results.sort((a, b) => a.url.localeCompare(b.url))
const totals: Record<string, number> = {}
for (const result of results) totals[result.outcome] = (totals[result.outcome] ?? 0) + 1
const checkedAt = new Date().toISOString()
await mkdir(new URL('docs/', root), { recursive: true })
await writeFile(new URL('docs/catalog-link-report.json', root), JSON.stringify({ checkedAt, entries: catalog.length, uniqueUrls: jobs.length, totals, results }, null, 2) + '\n')
const markdown = [
  '# Catalog link report', '', `Checked at: ${checkedAt}`, '',
  `${catalog.length} entries; ${jobs.length} unique URLs requested with GET. Shared launchers are checked once for all associated entries.`, '',
  'HTTP 403 is **blocked, check manually**, never broken. Network/TLS/timeouts, HTTP 401 and rate limits also need manual investigation. HTTP 200 confirms reachability only, not price, language, course availability, or human verification.', '',
  '| Outcome | Unique URLs |', '| --- | ---: |',
  ...Object.entries(totals).map(([outcome, count]) => `| ${outcome} | ${count} |`), '',
  '| Entries | Status | Outcome | Requested URL | Final URL / note |', '| --- | ---: | --- | --- | --- |',
  ...results.map(r => `| ${r.ids.join(', ')} | ${r.status ?? '—'} | ${r.outcome} | [course](${r.url}) | ${r.finalUrl && r.finalUrl !== r.url ? `[destination](${r.finalUrl}) — ` : ''}${r.note.replaceAll('|', '\\|')} |`), '',
]
await writeFile(new URL('docs/catalog-link-report.md', root), markdown.join('\n'))
console.log(`\n${catalog.length} entries; ${jobs.length} unique URLs: ${JSON.stringify(totals)}`)
if (results.some(r => ['broken', 'HTTP failure', 'network error'].includes(r.outcome))) process.exitCode = 1
