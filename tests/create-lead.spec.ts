import { test, expect } from '../fixtures/salesforce-fixtures';
import { HomePage } from '../pages/home-page';
import { LeadListPage } from '../pages/lead-list-page';
import { LeadFormPage } from '../pages/lead-form-page';

test.use({ storageState: 'auth/auth_state.json' });

test.describe('Lead Creation', () => {

  test('User can create a new lead', async ({ authenticatedPage }) => {
    const home = new HomePage(authenticatedPage);
    const leadList = new LeadListPage(authenticatedPage);
    const leadForm = new LeadFormPage(authenticatedPage);

    // Navigate to Leads
    await home.navigateToSales();
    await leadList.clickNewLead();

    // Create Lead
    const lastName = `AutoLead-${Date.now()}`;
    const company = `TestCorp-${Date.now()}`;

    await leadForm.createLead(lastName, company);
    
    // Assertions
    await expect(leadForm.leadStatusValue()).toHaveText(/New/i); // Verify Lead Status is 'New'    

  });
});