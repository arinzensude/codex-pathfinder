import type { Language } from '../i18n'

export interface Course {
  id: string
  title: string
  provider: string
  url: string
  goals: string[]
  level: 'new' | 'basics' | 'intermediate'
  hours: number
  cost: 'free' | 'paid'
  priceNote?: string
  dataWeight: 'low' | 'medium' | 'high'
  language: Language
  format: 'video' | 'text' | 'interactive'
  sourceNote: string
  lastVerified: string | null
}

// Draft records retain all schema fields but allow unknown values until sourced.
export type DraftCourse = Omit<Course, 'level' | 'hours' | 'cost' | 'dataWeight' | 'language' | 'format'> & {
  [K in 'level' | 'hours' | 'cost' | 'dataWeight' | 'language' | 'format']: Course[K] | null
}

export interface LearnerProfile {
  goal: string
  level: Course['level']
  why: string
  hoursPerWeek: number
  device: 'phone' | 'laptop'
  data: 'very_limited' | 'some' | 'plenty'
  budget: 'free_only' | 'can_pay'
  language: Language
}
