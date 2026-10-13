import { expect, it } from 'vitest'
import { formatDuration } from './duration'

it.each([
  [0.5, '30 min'], [0.75, '45 min'], [1, '1 hr'], [1.5, '1 hr 30 min'],
  [2.25, '2 hr 15 min'], [1.999, '2 hr'], [0, '0 min'], [null, 'Unknown'],
])('formats %s hours as %s', (hours, expected) => {
  expect(formatDuration(hours, 'en')).toBe(expected)
})
it('localizes durations and unknown values', () => {
  expect(formatDuration(1.5, 'fr')).toBe('1 h 30 min')
  expect(formatDuration(null, 'fr')).toBe('Inconnu')
})
