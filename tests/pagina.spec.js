// @ts-check
const { test, expect } = require('@playwright/test')

const TAMANHOS = [
  { nome: 'celular', width: 390, height: 844 },
  { nome: 'computador', width: 1440, height: 900 },
]

// Rola em passos até o fim, pra passar por todas as cenas presas (GSAP
// precisa de vários quadros pra reagir a cada posição).
async function rolaAteOFim (page, passo) {
  const altura = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y <= altura; y += passo) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(80)
  }
}

for (const { nome, width, height } of TAMANHOS) {
  for (const reducedMotion of (/** @type {const} */ (['no-preference', 'reduce']))) {
    test(`sem rolagem lateral — ${nome}, movimento ${reducedMotion}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion })
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await rolaAteOFim(page, height)
      const excesso = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(excesso).toBeLessThanOrEqual(1)
    })
  }
}

test('sem erro no console ao rolar a página inteira', async ({ page }) => {
  const erros = []
  page.on('pageerror', (e) => erros.push(String(e)))
  page.on('console', (msg) => { if (msg.type() === 'error') erros.push(msg.text()) })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await rolaAteOFim(page, 300)
  expect(erros).toEqual([])
})
