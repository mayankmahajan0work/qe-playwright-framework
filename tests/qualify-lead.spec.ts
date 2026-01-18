import { test, expect } from '../fixtures/salesforce-fixtures';
import { LeadDetailPage } from '../pages/lead-detail-page';

test.use({ storageState: 'auth/auth_state.json' });

test.describe('Lead Qualification', () => {

  test('Sales Rep can qualify an existing Lead', async ({ authenticatedPage, leadFixture }) => {
    const leadDetail = new LeadDetailPage(authenticatedPage);

    // Lead is already created via fixture
    console.log(`Testing with lead: ${leadFixture.lastName}`);

    // Action: Qualify the Lead
    await leadDetail.updateLeadStatusToQualified();
    
    // Assertions
    await expect(leadDetail.leadStatusValue()).toHaveText(/Qualified/i);

  });

});