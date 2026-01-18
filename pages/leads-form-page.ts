import { Page, Locator, expect } from '@playwright/test';

export class LeadsFormPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

    // Locators
    lastNameInput(): Locator {
        return this.page.getByRole('textbox', { name: 'Last Name' });
    }

    companyInput(): Locator {
        return this.page.getByRole('textbox', { name: 'Company' });
    }

    leadStatusDropdown(): Locator {
        return this.page.getByRole('combobox', { name: 'Lead Status' })
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
    
    // Actions
    async createLead (lastName: string) {
        await this.lastNameInput().fill(lastName); // Fill Last Name
        await this.companyInput().fill('TestCorp'); // Fill Company as well
        await this.saveButton().click(); // Click Save    
        await expect(this.successToast()).toBeVisible(); // Verify success toast
        await expect(this.leadStatusValue()).toHaveText(/New/i); // Verify Lead Status is 'New'
    
    }
}