// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { LANGUAGE_KEY, loadLanguage, saveLanguage } from './language'
afterEach(() => { localStorage.clear(); vi.restoreAllMocks() })
it('persists either supported language and ignores invalid preferences', () => {
  expect(loadLanguage()).toBeNull()
  saveLanguage('fr')
  expect(loadLanguage()).toBe('fr')
  saveLanguage('en')
  expect(loadLanguage()).toBe('en')
  localStorage.setItem(LANGUAGE_KEY, 'invalid')
  expect(loadLanguage()).toBeNull()
})
it('handles unavailable storage without crashing on startup', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Denied') })
  expect(loadLanguage()).toBeNull()
})
