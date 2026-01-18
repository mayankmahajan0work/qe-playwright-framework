import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  //retries: 1,
  workers: 1, // Run tests sequentially to avoid Salesforce concurrency issues
  fullyParallel: false,

  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    //video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    baseURL: 'https://computing-ability-8321.my.salesforce.com',
    storageState: 'auth/auth_state.json',
  },

  reporter: [['html', { open: 'never' }]],
});