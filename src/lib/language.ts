import type { Language } from '../i18n'

export const LANGUAGE_KEY = 'pathfinder.language.v1'
export function loadLanguage(): Language | null {
  try {
    const value = localStorage.getItem(LANGUAGE_KEY)
    return value === 'en' || value === 'fr' ? value : null
  } catch { return null }
}
export function saveLanguage(language: Language) {
  localStorage.setItem(LANGUAGE_KEY, language)
}
