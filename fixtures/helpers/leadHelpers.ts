import { Page } from '@playwright/test';
import { HomePage } from '../../pages/home-page';
import { LeadListPage } from '../../pages/lead-list-page';
import { LeadFormPage } from '../../pages/lead-form-page';

/**
 * Helper: Creates a new lead with unique test data
 * @param page - Playwright page object
 * @returns Lead data (lastName, company)
 */
export async function createLead(page: Page) {
  const home = new HomePage(page);
  const leadList = new LeadListPage(page);
  const leadForm = new LeadFormPage(page);
  
  // Navigate to lead creation
  await home.navigateToSales();
  await leadList.clickNewLead();
  
  // Generate unique test data
  const lastName = `Lead-${Date.now()}`;
  const company = `Corp-${Date.now()}`;
  
  // Create the lead
  await leadForm.createLead(lastName, company);
  
  return { lastName, company };
}
