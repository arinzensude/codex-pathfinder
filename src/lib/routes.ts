export const screens = [
  { id: 'welcome', path: '/' },
  { id: 'goal', path: '/goal' },
  { id: 'why', path: '/why' },
  { id: 'constraints', path: '/constraints' },
  { id: 'path', path: '/path' },
  { id: 'saved', path: '/saved' },
] as const

export type ScreenId = (typeof screens)[number]['id']
