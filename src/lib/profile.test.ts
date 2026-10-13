import { expect, it } from 'vitest'
import { catalogGoals, validHours } from './profile'

it('includes multiple goals per course and removes repeated goals', () => {
  expect(catalogGoals([
    { goals: ['python-programming', 'data-analysis'] },
    { goals: ['data-analysis', 'machine-learning'] },
  ])).toEqual(['python-programming', 'data-analysis', 'machine-learning'])
})
it('rejects empty, nonfinite and impossible weekly hours', () => {
  for (const hours of [NaN, Infinity, 0, -1, 169]) expect(validHours(hours)).toBe(false)
  for (const hours of [0.5, 4, 168]) expect(validHours(hours)).toBe(true)
})
