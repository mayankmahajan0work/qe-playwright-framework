import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 1,

  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },

  reporter: [['html', { open: 'never' }]],
});