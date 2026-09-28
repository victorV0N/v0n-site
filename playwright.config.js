// @ts-check
const { defineConfig } = require('@playwright/test')

// Contra as duas regressões que a mão já causou nesta sessão: rolagem
// lateral e crash silencioso do JS das cenas presas. Sobe o dev.js sozinho.
module.exports = defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:4173' },
  webServer: { command: 'node dev.js', port: 4173, reuseExistingServer: !process.env.CI },
})
