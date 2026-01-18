import { test as base, Page } from '@playwright/test';

type SalesforceFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<SalesforceFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to Salesforce home page
    await page.goto('/');
    
    // Wait for page to be ready (wait for any Salesforce element to confirm we're logged in)
    await page.waitForLoadState('domcontentloaded');
    
    // Provide the page to the test
    await use(page);
    
    // Cleanup happens automatically after test
  },
});

export { expect } from '@playwright/test';
