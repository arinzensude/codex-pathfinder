import type { Course, LearnerProfile } from '../types'
export type ProfileDraft = Omit<LearnerProfile, 'goal'> & { goal: LearnerProfile['goal'] | '' }
export const initialProfile: ProfileDraft = {
  goal: '', level: 'new', why: '', hoursPerWeek: 4,
  device: 'phone', data: 'some', budget: 'free_only', language: 'en',
}
export function catalogGoals(courses: Pick<Course, 'goals'>[]) {
  return [...new Set(courses.flatMap(course => course.goals))]
}
export function validHours(hours: number) {
  return Number.isFinite(hours) && hours >= 0.5 && hours <= 168
}

