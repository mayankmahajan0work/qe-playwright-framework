import { test as base, Page } from '@playwright/test';
import { createLead } from './helpers/leadHelpers';

type LeadData = {
  lastName: string;
  company: string;
};

type SalesforceFixtures = {
  authenticatedPage: Page;
  leadFixture: LeadData;
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

  leadFixture: async ({ authenticatedPage }, use) => {
    // Create a new lead using the helper function
    const leadData = await createLead(authenticatedPage);
    
    // Provide lead data to the test
    await use(leadData);
    
    // Cleanup: No cleanup needed for leads (they can remain in Salesforce)
  },
});

export { expect } from '@playwright/test';
