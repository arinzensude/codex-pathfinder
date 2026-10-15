import { translate } from '../i18n'
import type { Course, LearnerProfile, Level } from '../types'

export interface CourseScore {
  score: number
  reasons: string[]
}

const levels: Level[] = ['new', 'basics', 'intermediate']
const dataRanks = { low: 0, medium: 1, high: 2 }
const dataAllowance = { very_limited: 0, some: 1, plenty: 2 }
const TARGET_WEEKS = 8
const LOW_SCORE = 50

export function scoreCourse(course: Course, profile: LearnerProfile): CourseScore {
  let score = 0
  const reasons: string[] = []
  function factor(points: number, reason: string) {
    score += points
    reasons.push(translate('score.' + reason, profile.language))
  }

  const goalMatch = course.goals.includes(profile.goal)
  factor(goalMatch ? 35 : 0, goalMatch ? 'goalMatch' : 'goalMismatch')

  if (course.level === null) factor(0, 'levelUnknown')
  else {
    const distance = Math.abs(levels.indexOf(course.level) - levels.indexOf(profile.level))
    factor(distance === 0 ? 20 : distance === 1 ? 10 : 0,
      distance === 0 ? 'levelMatch' : distance === 1 ? 'levelAdjacent' : 'levelMismatch')
  }

  if (course.hours === null) factor(0, 'hoursUnknown')
  else {
    const fits = Number.isFinite(course.hours) && course.hours >= 0 &&
      Number.isFinite(profile.hoursPerWeek) && profile.hoursPerWeek > 0 &&
      course.hours <= profile.hoursPerWeek * TARGET_WEEKS
    factor(fits ? 15 : 0, fits ? 'timeMatch' : 'timeMismatch')
  }

  const dataFits = dataRanks[course.dataWeight] <= dataAllowance[profile.data]
  factor(dataFits ? 10 : 0, dataFits ? 'dataMatch' : 'dataMismatch')

  if (course.cost === null) factor(0, 'costUnknown')
  else {
    const costFits = course.cost === 'free' || profile.budget === 'can_pay'
    factor(costFits ? 10 : 0, costFits ? 'costMatch' : 'costMismatch')
  }

  const languageMatch = course.language === profile.language
  factor(languageMatch ? 10 : 0, languageMatch ? 'languageMatch' : 'languageMismatch')
  if (score < LOW_SCORE) reasons.push(translate('score.caution', profile.language))
  return { score, reasons }
}

/** Prefer nearby levels, then the learner's language within that group.
 * Then order by level and descending score; ties retain catalog order.
 * Relevant lower levels are available as optional refreshers.
 */
export function buildPath(catalog: readonly Course[], profile: LearnerProfile): Course[] {
  const levelRank = (course: Course) => course.level === null ? levels.length : levels.indexOf(course.level)
  return catalog
    .filter(course => course.lastVerified !== null && course.goals.includes(profile.goal) && course.level !== null && levelRank(course) >= levels.indexOf(profile.level))
    .map((course, index) => ({ course, index, score: scoreCourse(course, profile).score }))
    .sort((a, b) => {
      const aDistant = levelRank(a.course) - levels.indexOf(profile.level) >= 2
      const bDistant = levelRank(b.course) - levels.indexOf(profile.level) >= 2
      return Number(aDistant) - Number(bDistant) ||
        (!aDistant ? Number(b.course.language === profile.language) - Number(a.course.language === profile.language) : 0) ||
        b.score - a.score || a.index - b.index
    })
    .slice(0, 5)
    .sort((a, b) => levelRank(a.course) - levelRank(b.course) || b.score - a.score || a.index - b.index)
    .map(({ course }) => course)
}

export function supplementaryCourses(catalog: readonly Course[], profile: LearnerProfile) {
  const verified = catalog.filter(course => course.lastVerified !== null)
  const ranked = (courses: Course[]) => courses.map((course, index) => ({ course, index, score: scoreCourse(course, profile).score }))
    .sort((a, b) => b.score - a.score || a.index - b.index).map(({ course }) => course)
  return {
    refreshers: ranked(verified.filter(course => course.level !== null && course.goals.includes(profile.goal) && levels.indexOf(course.level) < levels.indexOf(profile.level))).slice(0, 5),
  }
}
