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
  let screenNumber = 0
  const audit = async (language: string) => {
    const issues = await page.evaluate(() => {
      const issues: string[] = []
      if (document.documentElement.scrollWidth > innerWidth) issues.push('Horizontal overflow')
      for (const element of document.querySelectorAll<HTMLElement>('button, a, input, textarea, summary')) {
        if (!element.checkVisibility()) continue
        const target = element.matches('input[type="radio"]') ? element.closest('label')! : element
        const rect = target.getBoundingClientRect()
        if (rect.width < 44 || rect.height < 44) issues.push('Small target: ' + (target.textContent || element.id))
        const named = element.getAttribute('aria-label') || element.textContent?.trim() ||
          (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? element.labels?.[0]?.textContent : '')
        if (!named) issues.push('Unnamed control: ' + element.tagName)
      }
      return issues
    })
    expect(issues).toEqual([])
    await page.screenshot({ path: `test-results/mobile-${screenNumber}-${language}.png`, fullPage: true })
  }
  const toggle = async (english: string, french: string) => {
    screenNumber++
    await page.getByRole('button', { name: 'Français', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(french)
    await audit('fr')
    await page.getByRole('button', { name: 'English', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(english)
    await audit('en')
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
  await page.getByRole('button', { name: 'Recommencer' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Trouvez votre prochaine étape')
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  expect(await page.evaluate(() => localStorage.getItem('pathfinder.savedPath.v1'))).toBeNull()
  await page.keyboard.press('Tab')
  const focus = await page.evaluate(() => {
    const element = document.activeElement!
    return { visible: element.matches(':focus-visible'), style: getComputedStyle(element).outlineStyle }
  })
  expect(focus.visible).toBe(true)
  expect(focus.style).not.toBe('none')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Trouvez votre prochaine étape')
})
