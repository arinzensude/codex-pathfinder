// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { initialProfile } from './profile'
import { loadSavedPath, savePath, SAVED_PATH_KEY } from './storage'
import type { Course, LearnerProfile } from '../types'

const profile: LearnerProfile = { ...initialProfile, goal: 'python-programming', why: 'Learn for work' }
const course: Course = { id: 'fixture', title: 'Fixture', provider: 'Test', url: 'https://example.com',
  goals: ['python-programming'], hours: null, level: null, cost: null, dataWeight: 'low', language: 'en',
  format: 'text', sourceNote: 'Test only', lastVerified: '2026-10-13' }
afterEach(() => { localStorage.clear(); vi.restoreAllMocks() })
it('round-trips full course snapshots and the profile, including unknown fields', () => {
  const saved = savePath(profile, [course])
  expect(loadSavedPath()).toEqual(saved)
})
it.each(['invalid json', '{}', JSON.stringify({ version: 2, profile, path: [course] }),
  JSON.stringify({ version: 1, profile, path: [{ ...course, lastVerified: null }] }),
  JSON.stringify({ version: 1, profile: { ...profile, hoursPerWeek: 0 }, path: [course] }),
  JSON.stringify({ version: 1, profile, path: [{ ...course, url: 'javascript:alert(1)' }] }),
  JSON.stringify({ version: 1, profile, path: [] }),
])('ignores malformed or unsafe saved state', raw => {
  localStorage.setItem(SAVED_PATH_KEY, raw)
  expect(loadSavedPath()).toBeNull()
})
it('handles unavailable storage on read and propagates failed writes', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Denied') })
  expect(loadSavedPath()).toBeNull()
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Full') })
  expect(() => savePath(profile, [course])).toThrow('Full')
})
