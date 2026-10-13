import { describe, expect, it } from 'vitest'
import { screens } from './routes'

describe('screen routes', () => {
  it('provides six unique destinations in the demo flow order', () => {
    expect(screens.map(screen => screen.id)).toEqual(['welcome', 'goal', 'why', 'constraints', 'path', 'saved'])
    expect(new Set(screens.map(screen => screen.path)).size).toBe(6)
    expect(screens[0].path).toBe('/')
  })
})
