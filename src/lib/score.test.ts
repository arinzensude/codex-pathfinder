import { describe, expect, it } from 'vitest'
import { translate } from '../i18n'
import type { Course, LearnerProfile } from '../types'
import { buildPath, scoreCourse, supplementaryCourses } from './score'
import catalog from '../data/catalog.json'

const profile: LearnerProfile = {
  goal: 'python-programming', level: 'new', why: 'Automate tasks', hoursPerWeek: 4,
  device: 'phone', data: 'very_limited', budget: 'free_only', language: 'en',
}
// Synthetic fixtures exercise scoring only; they are not catalog entries.
const course: Course = {
  id: 'fixture', title: 'Test fixture', provider: 'Test', url: 'https://example.com',
  goals: ['python-programming'], level: 'new', hours: 32, cost: 'free',
  dataWeight: 'low', language: 'en', format: 'text', sourceNote: 'Test fixture',
  lastVerified: '2026-10-13',
}
const score = (patch: Partial<Course> = {}, learner: Partial<LearnerProfile> = {}) =>
  scoreCourse({ ...course, ...patch }, { ...profile, ...learner })

describe('scoreCourse', () => {
  it('awards a perfect match 100 points with six readable reasons', () => {
    expect(score().score).toBe(100)
    expect(score().reasons).toHaveLength(6)
    expect(score().reasons.every(reason => reason.length > 0)).toBe(true)
  })
  it('awards 35 points for goal overlap, including multi-goal courses', () => {
    expect(score({ goals: ['data-analysis'] }).score).toBe(65)
    expect(score({ goals: ['data-analysis', 'python-programming'] }).score).toBe(100)
  })
  it('awards 20 for the same level, 10 for adjacent levels, and zero for two away', () => {
    expect(score({ level: 'basics' }).score).toBe(90)
    expect(score({ level: 'intermediate' }).score).toBe(80)
    expect(score({ level: 'new' }, { level: 'basics' }).score).toBe(90)
    expect(score({ level: 'new' }, { level: 'intermediate' }).score).toBe(80)
  })
  it('awards 15 within eight weeks including the exact boundary', () => {
    expect(score({ hours: 31 }).score).toBe(100)
    expect(score({ hours: 32 }).score).toBe(100)
    expect(score({ hours: 32.5 }).score).toBe(85)
    expect(score({}, { hoursPerWeek: 0 }).score).toBe(85)
  })
  it.each([
    ['very_limited', 'low', 100], ['very_limited', 'medium', 90], ['very_limited', 'high', 90],
    ['some', 'low', 100], ['some', 'medium', 100], ['some', 'high', 90],
    ['plenty', 'low', 100], ['plenty', 'medium', 100], ['plenty', 'high', 100],
  ] as const)('scores data allowance %s and weight %s', (data, dataWeight, expected) => {
    expect(score({ dataWeight }, { data }).score).toBe(expected)
  })
  it('awards 10 for free-only matches and either known cost when payment is allowed', () => {
    expect(score({ cost: 'paid' }).score).toBe(90)
    expect(score({ cost: 'paid' }, { budget: 'can_pay' }).score).toBe(100)
    expect(score({ cost: 'free' }, { budget: 'can_pay' }).score).toBe(100)
  })
  it('awards 10 for the learner language and translates the reasons', () => {
    expect(score({ language: 'fr' }).score).toBe(90)
    const result = score({ language: 'fr' }, { language: 'fr' })
    expect(result.score).toBe(100)
    expect(result.reasons).toContain(translate('score.languageMatch', 'fr'))
  })
  it.each([
    ['level', 80, 'levelUnknown'], ['hours', 85, 'hoursUnknown'], ['cost', 90, 'costUnknown'],
  ] as const)('gives unknown %s no points and explains it', (field, expected, reason) => {
    const result = score({ [field]: null }, { budget: 'can_pay' })
    expect(result.score).toBe(expected)
    expect(result.reasons).toContain(translate('score.' + reason))
  })
  it('handles all unknown factors without guessing', () => {
    expect(score({ level: null, hours: null, cost: null }).score).toBe(55)
  })
  it('penalizes high data and paid courses for a restricted learner without excluding them', () => {
    const result = score({ dataWeight: 'high', cost: 'paid' })
    expect(result.score).toBe(80)
    expect(result.reasons).toContain(translate('score.dataMismatch'))
    expect(result.reasons).toContain(translate('score.costMismatch'))
  })
  it('adds the caution below 50, including when every factor mismatches', () => {
    const result = score({ goals: ['aws-cloud'], level: 'intermediate', hours: 100,
      dataWeight: 'high', cost: 'paid', language: 'fr' })
    expect(result.score).toBe(0)
    expect(result.reasons).toContain('May be harder for you.')
    expect(score({ goals: [], hours: 100 }).score).toBe(50)
    expect(score({ goals: [], hours: 100 }).reasons).not.toContain('May be harder for you.')
  })
})

describe('buildPath', () => {
  it('keeps the English beginner data-analysis path entirely in English when five qualify', () => {
    const learner: LearnerProfile = { ...profile, goal: 'data-analysis', level: 'new', hoursPerWeek: 4,
      data: 'very_limited', budget: 'free_only', language: 'en' }
    const path = buildPath(catalog as Course[], learner)
    expect(path).toHaveLength(5)
    expect(path.every(course => course.language === 'en')).toBe(true)
  })
  it('starts the French beginner data-analysis path with French Python foundations', () => {
    const learner: LearnerProfile = { ...profile, goal: 'data-analysis', level: 'new', hoursPerWeek: 4,
      data: 'very_limited', budget: 'free_only', language: 'fr' }
    const path = buildPath(catalog as Course[], learner)
    expect(path).toHaveLength(5)
    expect(path.slice(0, 2).map(course => course.id)).toEqual(['fr-python-bases', 'fr-python-analysis'])
    const eligibleFrench = catalog.filter(course => course.lastVerified !== null && (course.level === 'new' || course.level === 'basics') &&
      course.goals.includes('data-analysis') && course.language === 'fr')
    expect(path.filter(course => course.language === 'fr')).toHaveLength(Math.min(5, eligibleFrench.length))
    expect(path.every(course => course.goals.includes('data-analysis'))).toBe(true)
  })
  it('starts a beginner data-analysis path with a Python foundation in step 1 or 2', () => {
    const learner: LearnerProfile = { ...profile, goal: 'data-analysis', level: 'new',
      hoursPerWeek: 4, data: 'very_limited', budget: 'free_only', language: 'en' }
    const path = buildPath(catalog as Course[], learner)
    const pythonIds = ['kaggle-python', 'kaggle-intro-programming', 'py4e', 'fr-python-bases']
    expect(path.length).toBeGreaterThanOrEqual(2)
    expect(path.slice(0, 2).some(course => pythonIds.includes(course.id))).toBe(true)
    expect(path.every(course => course.goals.includes(learner.goal))).toBe(true)
    for (const id of pythonIds) {
      const course = catalog.find(course => course.id === id)!
      expect(course.goals).toEqual(expect.arrayContaining(['python-programming', 'data-analysis', 'machine-learning']))
    }
  })
  const entry = (id: string, patch: Partial<Course> = {}): Course => ({ ...course, id, ...patch })
  it('selects the top five by score before ordering by level', () => {
    const catalog = [entry('excluded', { goals: [], level: 'intermediate', hours: 100 }),
      entry('intermediate', { level: 'intermediate' }), entry('basics', { level: 'basics' }),
      entry('new-a'), entry('new-b'), entry('unknown', { level: null })]
    expect(buildPath(catalog, profile).map(item => item.id))
      .toEqual(['new-a', 'new-b', 'basics', 'intermediate'])
    expect(catalog.map(item => item.id)).toEqual(['excluded', 'intermediate', 'basics', 'new-a', 'new-b', 'unknown'])
  })
  it('returns poor matches with caution reasons when no course fits well', () => {
    const catalog = ['a', 'b', 'c'].map(id => entry(id, {
      goals: ['python-programming'], level: 'intermediate', hours: 100,
      cost: 'paid', dataWeight: 'high', language: 'fr',
    }))
    expect(buildPath(catalog, profile)).toEqual(catalog)
    for (const item of buildPath(catalog, profile)) {
      expect(scoreCourse(item, profile).score).toBe(35)
      expect(scoreCourse(item, profile).reasons).toContain('May be harder for you.')
    }
  })
  it('excludes unverified entries even if their fit is perfect', () => {
    expect(buildPath([entry('draft', { lastVerified: null }), entry('verified')], profile))
      .toEqual([entry('verified')])
  })
  it('handles empty and small catalogs without duplicating or inventing courses', () => {
    expect(buildPath([], profile)).toEqual([])
    for (const count of [1, 2, 3, 4, 5, 6]) {
      const catalog = Array.from({ length: count }, (_, i) => entry(String(i)))
      expect(buildPath(catalog, profile).map(item => item.id))
        .toEqual(catalog.slice(0, 5).map(item => item.id))
    }
  })
  it.each([
    ['new', ['new', 'basics', 'intermediate'], []],
    ['basics', ['basics', 'intermediate'], ['new']],
    ['intermediate', ['intermediate'], ['new', 'basics']],
  ] as const)('starts at the %s learner level and separates other levels', (level, expected, refreshers) => {
    const learner = { ...profile, level }
    const catalog = [entry('new'), entry('basics', { level: 'basics' }),
      entry('intermediate', { level: 'intermediate' }), entry('unknown', { level: null }),
      entry('draft', { level: null, lastVerified: null })]
    expect(buildPath(catalog, learner).map(course => course.id)).toEqual(expected)
    expect(supplementaryCourses(catalog, learner).refreshers.map(course => course.id).sort()).toEqual([...refreshers].sort())
    expect(supplementaryCourses(catalog, learner)).not.toHaveProperty('unknown')
  })
  it('orders by score within each eligible level and does not pad a short path', () => {
    const learner = { ...profile, level: 'basics' as const }
    const catalog = [entry('low', { level: 'basics', cost: 'paid' }), entry('high', { level: 'basics' }),
      entry('refresher'), entry('unknown', { level: null })]
    expect(buildPath(catalog, learner).map(course => course.id)).toEqual(['high', 'low'])
    expect(buildPath(catalog, { ...learner, level: 'intermediate' })).toEqual([])
  })
  it('limits relevant verified refreshers to five highest scores with stable ties', () => {
    const learner = { ...profile, level: 'basics' as const }
    const catalog = [entry('lower-score', { cost: 'paid' }),
      ...Array.from({ length: 7 }, (_, i) => entry('match-' + i)),
      entry('unrelated', { goals: ['aws-cloud'] }), entry('draft', { lastVerified: null }),
      entry('unknown', { level: null }), entry('same-level', { level: 'basics' })]
    expect(supplementaryCourses(catalog, learner).refreshers.map(course => course.id))
      .toEqual(['match-0', 'match-1', 'match-2', 'match-3', 'match-4'])
    expect(supplementaryCourses(catalog, profile).refreshers).toEqual([])
  })
  it('selects preferred-language courses within one level first, fills by score, then preserves level ordering', () => {
    const catalog = [entry('preferred', { level: 'basics', hours: null, cost: 'paid', dataWeight: 'high' }),
      ...Array.from({ length: 5 }, (_, i) => entry('fallback-' + i, { language: 'fr', hours: i === 0 ? 100 : 1 }))]
    const path = buildPath(catalog, profile)
    expect(path.map(course => course.id)).toEqual(['fallback-1', 'fallback-2', 'fallback-3', 'fallback-4', 'preferred'])
    expect(buildPath(catalog.slice(0, 1), profile)).toEqual(catalog.slice(0, 1))
  })
  it('keeps intermediate courses out of the French beginner data-analysis path when five closer courses exist', () => {
    const learner: LearnerProfile = { ...profile, goal: 'data-analysis', language: 'fr' }
    const path = buildPath(catalog as Course[], learner)
    expect(path).toHaveLength(5)
    expect(path.every(course => course.level === 'new' || course.level === 'basics')).toBe(true)
    const closer = Array.from({ length: 5 }, (_, i) => entry('closer-' + i, {
      goals: ['data-analysis'], language: 'en', level: i % 2 ? 'basics' : 'new', hours: null, cost: null,
    }))
    const distant = entry('distant-french', { goals: ['data-analysis'], language: 'fr', level: 'intermediate' })
    expect(buildPath([distant, ...closer], learner).map(course => course.id)).not.toContain('distant-french')
    expect(buildPath([distant, ...closer.slice(0, 4)], learner).map(course => course.id)).toContain('distant-french')
    const distantFrenchLowScore = { ...distant, hours: null, cost: null }
    const distantEnglish = { ...distant, id: 'distant-english', language: 'en' as const }
    expect(buildPath([...closer.slice(0, 4), distantFrenchLowScore, distantEnglish], learner).map(course => course.id))
      .toContain('distant-english')
    expect(buildPath([...closer.slice(0, 4), distantFrenchLowScore, distantEnglish], learner).map(course => course.id))
      .not.toContain('distant-french')
  })
  it.each([
    ['python-programming', 'intermediate'], ['aws-cloud', 'basics'],
  ] as const)('keeps the %s %s path strictly on goal', (goal, level) => {
    const learner = { ...profile, goal, level }
    const path = buildPath(catalog as Course[], learner)
    expect(path.length).toBeGreaterThan(0)
    expect(path.every(course => course.goals.includes(goal))).toBe(true)
    const fixtures = [entry('off-goal', { goals: ['data-analysis'], level }),
      entry('on-goal', { goals: [goal], level }), entry('multi-goal', { goals: ['data-analysis', goal], level })]
    expect(buildPath(fixtures, learner).map(course => course.id)).toEqual(['on-goal', 'multi-goal'])
    expect(buildPath(fixtures.slice(0, 1), learner)).toEqual([])
  })
})
