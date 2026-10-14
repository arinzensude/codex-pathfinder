// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { initialProfile } from './profile'
import { loadSavedPath, savePath, SAVED_PATH_KEY } from './storage'
import type { Course, LearnerProfile } from '../types'

const profile: LearnerProfile = { ...initialProfile, goal: 'python-programming', why: 'Learn for work' }
const course: Course = { id: 'fixture', title: 'Fixture', provider: 'Test', url: 'https://example.com',
  goals: ['python-programming'], hours: null, level: 'basics', cost: null, dataWeight: 'low', language: 'en',
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
it('migrates old paths and excludes unknown levels after reload', () => {
  const learner = { ...profile, level: 'basics' as const }
  const beginner = { ...course, id: 'beginner', level: 'new' as const }
  const eligible = { ...course, id: 'eligible', level: 'basics' as const }
  localStorage.setItem(SAVED_PATH_KEY, JSON.stringify({ version: 1, profile: learner, path: [beginner, { ...course, level: null }] }))
  const restored = loadSavedPath([eligible])!
  expect(restored.path.map(course => course.id)).toEqual(['eligible'])
  expect(restored.refreshers).toEqual([beginner])
  expect(restored).not.toHaveProperty('unknown')
  savePath(restored.profile, restored.path, restored)
  expect(loadSavedPath()).toEqual(restored)
})
it('caps goal-matched refreshers and drops legacy unknown snapshots on migration and new saves', () => {
  const learner = { ...profile, level: 'intermediate' as const }
  const refreshers = Array.from({ length: 8 }, (_, i) => ({ ...course, id: 'r-' + i, level: 'basics' as const }))
  const unrelated = { ...course, id: 'unrelated', goals: ['aws-cloud' as const] }
  const unknown = { ...course, id: 'unknown', level: null }
  const eligible = { ...course, id: 'eligible', level: 'intermediate' as const }
  localStorage.setItem(SAVED_PATH_KEY, JSON.stringify({ version: 1, selectionVersion: 2, profile: learner,
    path: [eligible], refreshers: [...refreshers, unrelated], unknown: [unknown] }))
  const migrated = loadSavedPath()!
  expect(migrated.refreshers.map(course => course.id)).toEqual(['r-0', 'r-1', 'r-2', 'r-3', 'r-4'])
  expect(migrated).not.toHaveProperty('unknown')
  const saved = savePath(learner, [eligible, unknown], { refreshers: [...refreshers, unrelated] })
  expect(saved).toEqual(migrated)
  expect(loadSavedPath()).toEqual(migrated)
  expect(localStorage.getItem(SAVED_PATH_KEY)).not.toContain('"id":"unknown"')
})
