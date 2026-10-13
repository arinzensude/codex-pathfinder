import type { Course, LearnerProfile } from '../types'
import { validHours, type ProfileDraft } from './profile'

export const SAVED_PATH_KEY = 'pathfinder.savedPath.v1'
export interface SavedPath { version: 1; profile: LearnerProfile; path: Course[] }
const goals = ['python-programming', 'machine-learning', 'generative-ai-and-prompt-engineering', 'aws-cloud', 'data-analysis']
const levels = ['new', 'basics', 'intermediate']
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const member = (value: unknown, values: readonly string[]) => typeof value === 'string' && values.includes(value)

export function completeProfile(profile: ProfileDraft): profile is LearnerProfile {
  return member(profile.goal, goals) && profile.why.trim().length > 0 && validHours(profile.hoursPerWeek)
}

function validProfile(value: unknown): value is LearnerProfile {
  return record(value) && member(value.goal, goals) && member(value.level, levels) &&
    typeof value.why === 'string' && value.why.trim().length > 0 &&
    typeof value.hoursPerWeek === 'number' && validHours(value.hoursPerWeek) &&
    member(value.device, ['phone', 'laptop']) && member(value.data, ['very_limited', 'some', 'plenty']) &&
    member(value.budget, ['free_only', 'can_pay']) && member(value.language, ['en', 'fr'])
}

function validCourse(value: unknown): value is Course {
  if (!record(value)) return false
  const textFields = ['id', 'title', 'provider', 'url', 'sourceNote']
  return textFields.every(field => typeof value[field] === 'string') &&
    typeof value.url === 'string' && /^https?:\/\//i.test(value.url) &&
    Array.isArray(value.goals) && value.goals.every(goal => member(goal, goals)) &&
    (value.level === null || member(value.level, levels)) &&
    (value.hours === null || (typeof value.hours === 'number' && Number.isFinite(value.hours) && value.hours >= 0)) &&
    (value.cost === null || member(value.cost, ['free', 'paid'])) &&
    (value.priceNote === undefined || typeof value.priceNote === 'string') &&
    member(value.dataWeight, ['low', 'medium', 'high']) && member(value.language, ['en', 'fr']) &&
    member(value.format, ['video', 'text', 'interactive']) &&
    typeof value.lastVerified === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.lastVerified)
}

export function loadSavedPath(): SavedPath | null {
  try {
    const raw = localStorage.getItem(SAVED_PATH_KEY)
    if (!raw) return null
    const saved: unknown = JSON.parse(raw)
    if (!record(saved) || saved.version !== 1 || !validProfile(saved.profile) ||
      !Array.isArray(saved.path) || saved.path.length === 0 || saved.path.length > 5 ||
      !saved.path.every(validCourse) || new Set(saved.path.map(course => course.id)).size !== saved.path.length) return null
    return saved as unknown as SavedPath
  } catch { return null }
}

export function savePath(profile: LearnerProfile, path: Course[]): SavedPath {
  const saved: SavedPath = { version: 1, profile: { ...profile }, path }
  localStorage.setItem(SAVED_PATH_KEY, JSON.stringify(saved))
  return saved
}
