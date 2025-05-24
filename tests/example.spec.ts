import { expect } from '@playwright/test';
import { mobile, desktop, skip, registerTests } from './decorators';

// Define interface for test context
interface TestContext {
  page: any;
  context?: any;
  browser?: any;
}

class ResponsiveTests {
  @mobile
  async mobileLoginTest({ page }: TestContext) {
    // Verify the viewport is set correctly
    const viewport = page.viewportSize();
    console.log('Mobile test viewport:', viewport);
    expect(viewport.width).toBe(375);
    expect(viewport.height).toBe(667);
  }

  @desktop
  async desktopDashboardTest({ page }: TestContext) {
    // Verify the viewport is set correctly
    const viewport = page.viewportSize();
    console.log('Desktop test viewport:', viewport);
    expect(viewport.width).toBe(1920);
    expect(viewport.height).toBe(1080);
    
  }

  // This test will be skipped during execution
  @skip
  async skippedTest({ page }: TestContext) {
    await page.goto('https://example.com/broken-feature');
    await expect(page.locator('.broken-element')).toBeVisible();
  }

  // Test without decorator (runs with default configuration)
  async defaultConfigTest({ page }: TestContext) {
    const viewport = page.viewportSize();
    console.log('Default test viewport:', viewport);
    
    expect(viewport.width).toBe(1280);
    expect(viewport.height).toBe(720);
  }
}

// Register all tests from the class
registerTests(ResponsiveTests);
