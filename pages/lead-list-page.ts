import { Page, Locator, expect } from '@playwright/test';

export class LeadListPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

    // Locators
    newLeadButton(): Locator {
        return this.page.getByRole('button', { name: 'New', exact: true });
    }

    leadRowByName(leadName: string): Locator {
        return this.page.getByRole('link', { name: leadName});
    }

    // Actions
    async clickNewLead() {
        await this.newLeadButton().click();
        await expect(
            this.page.getByRole('heading', { name: 'New Lead' })
        ).toBeVisible();
    }

    async openLead(leadName: string) {
        await this.leadRowByName(leadName).click();
        await expect(
            //this.page.getByText(leadName, { exact: true })
            this.page.locator('records-record-layout h1', { hasText: leadName })
        ).toBeVisible();
    }

}