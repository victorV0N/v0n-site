// @ts-check
const { test, expect } = require('@playwright/test')

const TAMANHOS = [
  { nome: 'celular', width: 390, height: 844 },
  { nome: 'computador', width: 1440, height: 900 },
]

async function rolaAteOFim (page, passo) {
  const altura = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y <= altura; y += passo) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(60)
  }
}

for (const { nome, width, height } of TAMANHOS) {
  test(`/servicos sem rolagem lateral — ${nome}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/servicos/')
    await rolaAteOFim(page, height)
    const excesso = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(excesso).toBeLessThanOrEqual(1)
  })
}

test('/servicos sem erro no console e com os cinco sites, o sistema e os vídeos', async ({ page }) => {
  const erros = []
  page.on('pageerror', (e) => erros.push(String(e)))
  page.on('console', (msg) => { if (msg.type() === 'error') erros.push(msg.text()) })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/servicos/')
  await rolaAteOFim(page, 300)
  expect(erros).toEqual([])
  await expect(page.locator('#sites .site')).toHaveCount(5)
  await expect(page.locator('#sistemas .site')).toHaveCount(1)
  await expect(page.locator('#videos video')).toHaveCount(2)
})

test('a logo leva da /servicos pra home e o cabeçalho da home leva pra /servicos', async ({ page }) => {
  await page.goto('/servicos/')
  await page.locator('.topo__logo').click()
  await expect(page).toHaveURL(/\/(index\.html)?$/)
  await page.locator('.topo__menu a', { hasText: 'Serviços' }).click()
  await expect(page).toHaveURL(/\/servicos\/$/)
})
