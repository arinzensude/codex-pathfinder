// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import catalog from './data/catalog.json'
import en from './i18n/en.json'
import fr from './i18n/fr.json'
import { catalogGoals } from './lib/profile'
import type { Course } from './types'
import { SAVED_PATH_KEY, loadSavedPath, savePath } from './lib/storage'
import { initialProfile } from './lib/profile'
import { LANGUAGE_KEY } from './lib/language'

afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks() })
it('completes the flow and preserves answers through back navigation and language changes', async () => {
  const user = userEvent.setup()
  render(<MemoryRouter><App /></MemoryRouter>)
  await user.click(screen.getByRole('button', { name: 'Get started' }))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  expect(screen.getByRole('alert').textContent).toBe(en['errors.goal'])
  expect(screen.getAllByRole('radio').length).toBe(catalogGoals(catalog as Course[]).length + 3)
  await user.click(screen.getByLabelText('Python programming'))
  await user.click(screen.getByLabelText(en['levels.basics']))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  expect(screen.getByRole('alert').textContent).toBe(en['errors.why'])
  await user.type(screen.getByRole('textbox'), 'Automate my work')
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('4')
  await user.clear(screen.getByRole('spinbutton'))
  await user.click(screen.getByRole('button', { name: 'Finish profile' }))
  expect(screen.getByRole('alert').textContent).toBe(en['errors.hours'])
  await user.type(screen.getByRole('spinbutton'), '6')
  await user.click(screen.getByLabelText('Laptop'))
  await user.click(screen.getByLabelText(en['data.very_limited']))
  await user.click(screen.getByLabelText(en['budget.can_pay']))
  await user.click(screen.getByRole('button', { name: 'Français' }))
  expect(document.documentElement.lang).toBe('fr')
  expect((screen.getByLabelText(fr['devices.laptop']) as HTMLInputElement).checked).toBe(true)
  await user.click(screen.getByRole('button', { name: 'Retour' }))
  expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('Automate my work')
  await user.click(screen.getByRole('button', { name: 'Retour' }))
  expect((screen.getByLabelText(fr['levels.basics']) as HTMLInputElement).checked).toBe(true)
  expect((screen.getByLabelText(fr['goals.python-programming']) as HTMLInputElement).checked).toBe(true)
  await user.click(screen.getByRole('button', { name: 'Continuer' }))
  await user.click(screen.getByRole('button', { name: 'Continuer' }))
  expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('6')
  expect((screen.getByLabelText(fr['data.very_limited']) as HTMLInputElement).checked).toBe(true)
  expect((screen.getByLabelText(fr['budget.can_pay']) as HTMLInputElement).checked).toBe(true)
  await user.click(screen.getByRole('button', { name: 'Terminer le profil' }))
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(fr['screens.path.title'])
})

it('redirects an incomplete profile to the goal step', () => {
  render(<MemoryRouter initialEntries={['/constraints']}><App /></MemoryRouter>)
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(en['screens.goal.title'])
})

it('has matching, nonempty translations in both languages', () => {
  expect(Object.keys(fr).sort()).toEqual(Object.keys(en).sort())
  expect(Object.values(en).every(Boolean) && Object.values(fr).every(Boolean)).toBe(true)
})

const fixtureCourses: Course[] = [
  { id: 'short', title: 'Short fixture', provider: 'Fixture provider', url: 'https://example.com/short', goals: ['python-programming'],
    level: 'new', hours: 0.5, cost: 'free', dataWeight: 'low', language: 'en', format: 'text', sourceNote: 'Test only', lastVerified: '2026-10-13' },
  { id: 'long', title: 'Long fixture', provider: 'Fixture provider', url: 'https://example.com/long', goals: ['python-programming'],
    level: 'basics', hours: 1.5, cost: 'paid', dataWeight: 'medium', language: 'en', format: 'video', sourceNote: 'Test only', lastVerified: '2026-10-13' },
]
async function completeFlow(courses: Course[]) {
  const user = userEvent.setup()
  const view = render(<MemoryRouter><App courses={courses} /></MemoryRouter>)
  await user.click(screen.getByRole('button', { name: 'Get started' }))
  await user.click(screen.getByLabelText('Python programming'))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.type(screen.getByRole('textbox'), 'Build useful tools')
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.click(screen.getByRole('button', { name: 'Finish profile' }))
  return { user, view }
}
it('shows numbered course details and reasons, saves, and restores the same path on startup', async () => {
  const { user, view } = await completeFlow(fixtureCourses)
  expect(screen.getByText('Build useful tools')).toBeTruthy()
  expect(screen.getByText('30 min')).toBeTruthy()
  expect(screen.getByText('1 hr 30 min')).toBeTruthy()
  expect(screen.getByText('Step 1')).toBeTruthy()
  expect(screen.getByText('Step 2')).toBeTruthy()
  expect(screen.getByText('Paid')).toBeTruthy()
  expect(screen.getAllByText('2026-10-13')).toHaveLength(2)
  expect(screen.getAllByText(en['score.goalMatch'])).toHaveLength(2)
  const link = screen.getAllByRole('link', { name: en['course.source'] })[0]
  expect(link.getAttribute('target')).toBe('_blank')
  expect(link.getAttribute('rel')).toContain('noopener')
  await user.click(screen.getByRole('button', { name: 'Save on this device' }))
  expect(screen.getByText('Saved on this device, works offline')).toBeTruthy()
  expect(screen.getByRole('heading', { name: 'Coming next' })).toBeTruthy()
  expect(screen.getByText(/You said: “Build useful tools”/).textContent).toContain('step 1, Short fixture')
  expect(loadSavedPath()?.path).toEqual(fixtureCourses)
  await user.click(screen.getByRole('button', { name: 'Français' }))
  expect(loadSavedPath()?.profile.language).toBe('fr')
  expect(screen.getByText('1 h 30 min')).toBeTruthy()
  view.unmount()
  render(<MemoryRouter><App courses={[]} /></MemoryRouter>)
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(fr['screens.saved.title'])
  expect(screen.getByText('Short fixture')).toBeTruthy()
  await user.click(screen.getByRole('link', { name: fr['actions.edit'] }))
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(fr['screens.constraints.title'])
})
it('shows an empty state and no save button when only unverified courses exist', async () => {
  await completeFlow(fixtureCourses.map(course => ({ ...course, lastVerified: null })))
  expect(screen.getByText(en['path.empty'])).toBeTruthy()
  expect(screen.queryByRole('button', { name: en['actions.save'] })).toBeNull()
})
it('does not claim a successful save if localStorage fails', async () => {
  const { user } = await completeFlow(fixtureCourses)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Quota') })
  await user.click(screen.getByRole('button', { name: en['actions.save'] }))
  expect(screen.getByRole('alert').textContent).toBe(en['saved.error'])
  expect(screen.queryByText(en['saved.confirmation'])).toBeNull()
})
it('ignores corrupt saved data and starts with Welcome', () => {
  localStorage.setItem(SAVED_PATH_KEY, '{broken')
  render(<MemoryRouter><App /></MemoryRouter>)
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(en['screens.welcome.title'])
})
it('persists a language choice without requiring a saved path', async () => {
  const user = userEvent.setup()
  const view = render(<MemoryRouter><App /></MemoryRouter>)
  await user.click(screen.getByRole('button', { name: 'Français' }))
  expect(localStorage.getItem(LANGUAGE_KEY)).toBe('fr')
  view.unmount()
  render(<MemoryRouter><App /></MemoryRouter>)
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(fr['screens.welcome.title'])
})
it('keeps the language change usable and reports a failed preference write', async () => {
  render(<MemoryRouter><App /></MemoryRouter>)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Denied') })
  await userEvent.setup().click(screen.getByRole('button', { name: 'Français' }))
  expect(document.documentElement.lang).toBe('fr')
  expect(screen.getByRole('alert').textContent).toBe(fr['language.saveError'])
})
it('starts over from a saved path, clears saved answers and preserves the language', async () => {
  const { user, view } = await completeFlow(fixtureCourses)
  await user.click(screen.getByRole('button', { name: en['actions.save'] }))
  await user.click(screen.getByRole('button', { name: 'Français' }))
  await user.click(screen.getByRole('button', { name: fr['actions.startOver'] }))
  expect(localStorage.getItem(SAVED_PATH_KEY)).toBeNull()
  expect(localStorage.getItem(LANGUAGE_KEY)).toBe('fr')
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(fr['screens.welcome.title'])
  await user.click(screen.getByRole('button', { name: fr['actions.start'] }))
  expect(screen.getAllByRole('radio').every(radio => !(radio as HTMLInputElement).checked || (radio as HTMLInputElement).name === 'level')).toBe(true)
  view.unmount()
  render(<MemoryRouter><App /></MemoryRouter>)
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(fr['screens.welcome.title'])
})
it('keeps the saved path when clearing storage fails', async () => {
  const { user } = await completeFlow(fixtureCourses)
  await user.click(screen.getByRole('button', { name: en['actions.save'] }))
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('Denied') })
  await user.click(screen.getByRole('button', { name: en['actions.startOver'] }))
  expect(screen.getByRole('alert').textContent).toBe(en['errors.reset'])
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(en['screens.saved.title'])
  expect(loadSavedPath()).not.toBeNull()
})
it('focuses invalid inputs and describes the goal error', async () => {
  const user = userEvent.setup()
  render(<MemoryRouter><App /></MemoryRouter>)
  await user.click(screen.getByRole('button', { name: en['actions.start'] }))
  await user.click(screen.getByRole('button', { name: en['actions.continue'] }))
  expect(document.activeElement).toBe(screen.getAllByRole('radio')[0])
  expect(screen.getByRole('group', { name: en['goal.label'] }).getAttribute('aria-describedby')).toBe('form-error')
})
it('shows level metadata and relevant refreshers while excluding unknown levels in both languages', async () => {
  const user = userEvent.setup()
  const unknown = { ...fixtureCourses[0], id: 'unknown', title: 'Unknown fixture', level: null }
  const learner = { ...initialProfile, goal: 'python-programming', level: 'basics', why: 'Build useful tools' }
  localStorage.setItem(SAVED_PATH_KEY, JSON.stringify({ version: 1, profile: learner, path: [...fixtureCourses, unknown] }))
  render(<MemoryRouter><App courses={[...fixtureCourses, unknown]} /></MemoryRouter>)
  const main = screen.getByRole('list', { name: en['path.courses'] })
  expect(within(main).getByText('Long fixture')).toBeTruthy()
  expect(within(main).queryByText('Short fixture')).toBeNull()
  expect(within(main).queryByText('Unknown fixture')).toBeNull()
  expect(screen.getByText(en['path.shortage'])).toBeTruthy()
  await user.click(screen.getByText(/Optional refreshers/))
  expect(within(screen.getByRole('list', { name: en['path.refreshers'] })).getByText('Short fixture')).toBeTruthy()
  expect(screen.queryByText('Unknown fixture')).toBeNull()
  const labels = within(main).getAllByRole('term').map(term => term.textContent)
  expect(labels.slice(-2)).toEqual(['Level', 'Last verified'])
  expect(within(main).getByText(en['courseLevel.basics'])).toBeTruthy()
  expect(screen.getByText(en['path.ordering'])).toBeTruthy()
  await user.click(screen.getByRole('button', { name: 'Français' }))
  expect(screen.getByText(/Révisions facultatives/)).toBeTruthy()
  expect(screen.queryByText('Unknown fixture')).toBeNull()
  expect(screen.getByText(fr['path.ordering'])).toBeTruthy()
  expect(within(screen.getByRole('list', { name: fr['path.courses'] })).getByText(fr['courseLevel.basics'])).toBeTruthy()
  expect(loadSavedPath()?.path.map(course => course.id)).toEqual(['long'])
  await user.click(screen.getByRole('link', { name: fr['actions.edit'] }))
  await user.click(screen.getByRole('button', { name: fr['actions.finish'] }))
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(fr['screens.path.title'])
  expect(within(screen.getByRole('list', { name: fr['path.courses'] })).getByText('Long fixture')).toBeTruthy()
  expect(screen.getByText(/Révisions facultatives/)).toBeTruthy()
  expect(screen.queryByText('Unknown fixture')).toBeNull()
})
