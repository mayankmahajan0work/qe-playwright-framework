import { test, expect } from '../fixtures/salesforce-fixtures';
import { HomePage } from '../pages/home-page';
import { LeadListPage } from '../pages/lead-list-page';
import { LeadFormPage } from '../pages/lead-form-page';
import { LeadDetailPage } from '../pages/lead-detail-page';

test.use({ storageState: 'auth/auth_state.json' });

test.describe('Lead Qualification', () => {

  test('Sales Rep can qualify an existing Lead', async ({ authenticatedPage }) => {
    const home = new HomePage(authenticatedPage);
    const leadList = new LeadListPage(authenticatedPage);
    const leadForm = new LeadFormPage(authenticatedPage);
    const leadDetail = new LeadDetailPage(authenticatedPage);

    // Setup: Create a new Lead for this test
    const lastName = `QualifyLead-${Date.now()}`;
    const company = `QualifyCorp-${Date.now()}`;
    
    await home.navigateToSales();
    await leadList.clickNewLead();
    await leadForm.createLead(lastName, company);

    // Action: Qualify the Lead
    await leadDetail.updateLeadStatusToQualified();
    // Assertions are already in updateLeadStatusToQualified() method
  });

});