import { createConfiguredTest, mobile, desktop, skip } from './decorators';
import { expect } from '@playwright/test';

interface TestContext {
  page: any;
  context?: any;
  browser?: any;
}

class IndividualTests {
  @mobile
  static async quickMobileTest({ page }: TestContext) {
    await page.goto('https://example.com');
    await expect(page.locator('.mobile-header')).toBeVisible();
  }

  @desktop  
  static async quickDesktopTest({ page }: TestContext) {
    await page.goto('https://example.com');
    await expect(page.locator('.desktop-header')).toBeVisible();
  }

  @skip
  static async temporarilyDisabledTest({ page }: TestContext) {
    // This test is temporarily disabled
    await page.goto('https://example.com/wip-feature');
  }
}

// Manual registration for static methods
createConfiguredTest(IndividualTests.quickMobileTest, 'Quick Mobile Test');
createConfiguredTest(IndividualTests.quickDesktopTest, 'Quick Desktop Test');
createConfiguredTest(IndividualTests.temporarilyDisabledTest, 'Temporarily Disabled Test');