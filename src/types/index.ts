import type { Language } from '../i18n'

export type Goal = 'python-programming' | 'machine-learning' | 'generative-ai-and-prompt-engineering' | 'aws-cloud' | 'data-analysis'
export type Level = 'new' | 'basics' | 'intermediate'

export interface Course {
  id: string
  title: string
  provider: string
  url: string
  goals: Goal[]
  level: Level | null
  hours: number | null
  cost: 'free' | 'paid' | null
  priceNote?: string
  dataWeight: 'low' | 'medium' | 'high'
  language: Language
  format: 'video' | 'text' | 'interactive'
  sourceNote: string
  lastVerified: string | null
}

export type DraftCourse = Course

export interface LearnerProfile {
  goal: Goal
  level: Level
  why: string
  hoursPerWeek: number
  device: 'phone' | 'laptop'
  data: 'very_limited' | 'some' | 'plenty'
  budget: 'free_only' | 'can_pay'
  language: Language
}
