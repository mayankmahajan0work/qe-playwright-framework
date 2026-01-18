import { Page, Locator, expect } from '@playwright/test';

export class LeadDetailsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  editButton(): Locator {
    return this.page.getByRole('button', { name: 'Edit', exact: true });
  }

  leadStatusDropdown(): Locator {
    return this.page.getByRole('combobox', { name: 'Lead Status' });
  }

  qualifiedOption(): Locator {
    return this.page.getByRole('option', { name: 'Qualified', exact: true });
  }

  saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save', exact: true });
  }

  successToast(): Locator {
    return this.page.getByRole('alert');
  }

  leadStatusValue(): Locator {
    return this.page.getByRole('combobox', { name: 'Lead Status' });
  }

  // Action
  async updateLeadStatusToQualified() {
    await this.editButton().click();
    await this.leadStatusDropdown().click();
    await this.qualifiedOption().click();
    await this.saveButton().click();

    // Assertions
    await expect(this.successToast()).toBeVisible();
    await expect(this.leadStatusValue()).toHaveText(/Qualified/i);
  }
}