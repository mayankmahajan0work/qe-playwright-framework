import { Page, Locator, expect } from '@playwright/test';

export class LeadDetailPage {
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
        return this.page.getByText(/was saved/i);
    }

  leadStatusValue(): Locator {
      return this.page.locator('lightning-formatted-text:has-text("Qualified")');
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