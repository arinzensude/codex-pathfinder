// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CourseCard from './CourseCard'
import { translate } from '../i18n'
import type { Course, LearnerProfile } from '../types'

const profile: LearnerProfile = { goal: 'python-programming', level: 'new', why: 'Learn', hoursPerWeek: 4,
  device: 'phone', data: 'very_limited', budget: 'free_only', language: 'en' }
const course: Course = { id: 'fixture', title: 'Fixture course', provider: 'Test', url: 'https://example.com',
  goals: ['python-programming'], level: 'new', hours: 1, cost: 'free', dataWeight: 'low', language: 'en',
  format: 'text', sourceNote: 'Test only', lastVerified: '2026-10-13' }
afterEach(cleanup)
it('shows only two positives initially, keeps the score visible and expands the other four', async () => {
  render(<ul><CourseCard course={course} profile={profile} /></ul>)
  expect(screen.getByText('Fit score: 100/100').closest('details')).toBeNull()
  for (const key of ['goalMatch', 'levelMatch']) expect(screen.getByText(translate('score.' + key)).closest('details')).toBeNull()
  const summary = screen.getByText('More reasons')
  const details = summary.closest('details')!
  expect(details.open).toBe(false)
  expect(within(details).getAllByRole('listitem', { hidden: true })).toHaveLength(4)
  await userEvent.setup().click(summary)
  expect(details.open).toBe(true)
  expect(within(details).getAllByRole('listitem')).toHaveLength(4)
})
it('keeps all unknown, mismatch and caution reasons outside the disclosure in either language', () => {
  const poorCourse = { ...course, goals: [], level: null, hours: null, cost: null, dataWeight: 'high' as const, language: 'fr' as const }
  const view = render(<ul><CourseCard course={poorCourse} profile={profile} /></ul>)
  for (const key of ['goalMismatch', 'levelUnknown', 'hoursUnknown', 'costUnknown', 'dataMismatch', 'languageMismatch', 'caution']) {
    expect(screen.getByText(translate('score.' + key)).closest('details')).toBeNull()
  }
  expect(screen.queryByText('More reasons')).toBeNull()
  view.rerender(<ul><CourseCard course={{ ...poorCourse, language: 'en' }} profile={{ ...profile, language: 'fr' }} /></ul>)
  for (const key of ['goalMismatch', 'levelUnknown', 'hoursUnknown', 'costUnknown', 'dataMismatch', 'languageMismatch', 'caution']) {
    expect(screen.getByText(translate('score.' + key, 'fr')).closest('details')).toBeNull()
  }
  expect(screen.queryByText('Plus de raisons')).toBeNull()
})
it('keeps warnings visible even when more than two positives exist', () => {
  render(<ul><CourseCard course={{ ...course, level: 'basics', hours: null }} profile={profile} /></ul>)
  for (const key of ['levelAdjacent', 'hoursUnknown']) expect(screen.getByText(translate('score.' + key)).closest('details')).toBeNull()
  expect(within(screen.getByText('More reasons').closest('details')!).getAllByRole('listitem', { hidden: true })).toHaveLength(2)
})
it('localizes course languages independently from language toggle names', () => {
  const view = render(<ul><CourseCard course={{ ...course, language: 'fr' }} profile={profile} /></ul>)
  expect(screen.getByText('French')).toBeTruthy()
  view.rerender(<ul><CourseCard course={course} profile={{ ...profile, language: 'fr' }} /></ul>)
  expect(screen.getByText('Anglais')).toBeTruthy()
  expect(screen.getByText('Plus de raisons')).toBeTruthy()
  expect(translate('language.en', 'fr')).toBe('English')
  expect(translate('language.fr', 'en')).toBe('Français')
})
