import { test, expect } from '@playwright/test'

test('precaches install assets and catalog, and completes all six screens offline in both languages', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller) await new Promise<void>(resolve => {
      navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true })
    })
  })
  const manifest = await page.evaluate(async () => {
    const href = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')!.href
    return (await fetch(href)).json()
  })
  expect(manifest.name).toBe('Pathfinder')
  expect(manifest.display).toBe('standalone')
  expect(manifest.theme_color).toBe('#0f766e')
  expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toContain('192x192')
  expect(manifest.icons.some((icon: { purpose: string }) => icon.purpose === 'maskable')).toBe(true)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Find your next learning step')
  const cached = await page.evaluate(async () => {
    const catalog = await (await fetch('/catalog.json')).json()
    const icons = ['/icons/pwa-192.png', '/icons/pwa-512.png', '/icons/pwa-maskable-512.png']
    const dimensions = await Promise.all(icons.map(async url => {
      const image = await createImageBitmap(await (await fetch(url)).blob())
      return [image.width, image.height]
    }))
    return { count: catalog.length, dimensions }
  })
  expect(cached.count).toBe(100)
  expect(cached.dimensions).toEqual([[192, 192], [512, 512], [512, 512]])
  const toggle = async (english: string, french: string) => {
    await page.getByRole('button', { name: 'Français', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(french)
    await page.getByRole('button', { name: 'English', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(english)
  }
  await toggle('Find your next learning step', 'Trouvez votre prochaine étape')
  await page.getByRole('button', { name: 'Get started' }).click()
  await toggle('What do you want to learn?', 'Que souhaitez-vous apprendre ?')
  await page.getByLabel('Python programming', { exact: true }).check()
  await page.getByRole('button', { name: 'Continue' }).click()
  await toggle('What’s your reason?', 'Quelle est votre motivation ?')
  await page.getByRole('textbox').fill('Build tools for my work')
  await page.getByRole('button', { name: 'Continue' }).click()
  await toggle('Make learning fit your life', 'Adaptez l’apprentissage à votre quotidien')
  await page.getByRole('button', { name: 'Finish profile' }).click()
  await toggle('Your learning path', 'Votre parcours d’apprentissage')
  await expect(page.getByRole('link', { name: 'Open course source (new tab)' })).toHaveCount(5)
  await page.getByRole('button', { name: 'Save on this device' }).click()
  await toggle('Your saved path', 'Votre parcours enregistré')
  await page.getByRole('button', { name: 'Français', exact: true }).click()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Votre parcours enregistré')
  await expect(page.getByText('Build tools for my work', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'À venir' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ouvrir la source du cours (nouvel onglet)' })).toHaveCount(5)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/saved-offline-360.png', fullPage: true })
})
