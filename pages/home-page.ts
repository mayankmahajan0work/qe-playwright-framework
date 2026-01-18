import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  salesLink(): Locator {
    return this.page.getByRole('link', { name: 'Sales', exact: true });
  }

  accountsLink(): Locator {
    return this.page.getByRole('link', { name: 'Accounts' });
  }

  contactsLink(): Locator {
    return this.page.getByRole('link', { name: 'Contacts' });
  }

  globalSearchInput(): Locator {
    return this.page.getByRole('button', { name: 'Search' });
  }

  // Actions
  async navigateToSales() {
    await this.salesLink().click();
    await expect(
      this.page.getByRole('heading', { name: 'Leads' })
    ).toBeVisible();
  }

  async navigateToAccounts() {
    await this.accountsLink().click();
  }

  async navigateToContacts() {
    await this.contactsLink().click();
  }
}