import en from './en.json'
import fr from './fr.json'

export type Language = 'en' | 'fr'
const dictionaries: Record<Language, Record<string, string>> = { en, fr }

export function translate(key: string, language: Language = 'en', values: Record<string, string | number> = {}): string {
  const text = dictionaries[language][key] ?? dictionaries.en[key] ?? ''
  return text.replace(/\{(\w+)\}/g, (_, name: string) => String(values[name] ?? ''))
}
