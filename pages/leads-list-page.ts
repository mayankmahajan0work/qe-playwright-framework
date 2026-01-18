import { Page, Locator, expect } from '@playwright/test';

export class LeadsListPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

    // Locators
    newLeadButton(): Locator {
        return this.page.getByRole('button', { name: 'New', exact: true });
    }

    // Actions
    async clickNewLead() {
        await this.newLeadButton().click();
        await expect(
            this.page.getByRole('heading', { name: 'New Lead' })
        ).toBeVisible();
    }

}