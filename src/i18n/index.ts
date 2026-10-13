import en from './en.json'
import fr from './fr.json'

export type Language = 'en' | 'fr'
const dictionaries: Record<Language, Record<string, string>> = { en, fr }

// Empty dictionaries deliberately render no copy until translations are supplied.
export function translate(key: string, language: Language = 'en'): string {
  return dictionaries[language][key] ?? dictionaries.en[key] ?? ''
}
