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

  // @mobile
  // async mobileNavigationTest({ page }: TestContext) {
  //   await page.goto('https://example.com');
    
  //   // Test mobile hamburger menu
  //   await page.click('.hamburger-menu');
  //   await expect(page.locator('.mobile-nav')).toBeVisible();
    
  //   await page.click('.nav-link:has-text("About")');
  //   await expect(page).toHaveURL(/.*about/);
  // }

  // @desktop
  // async desktopFormTest({ page }: TestContext) {
  //   await page.goto('https://example.com/contact');
    
  //   // Desktop form interaction
  //   await page.fill('#name', 'John Doe');
  //   await page.fill('#email', 'john@example.com');
  //   await page.fill('#message', 'This is a test message');
    
  //   await page.click('#submit-btn');
  //   await expect(page.locator('.success-message')).toBeVisible();
  // }

  @skip
  async skippedTest({ page }: TestContext) {
    // This test will be skipped during execution
    await page.goto('https://example.com/broken-feature');
    await expect(page.locator('.broken-element')).toBeVisible();
  }

  // Test without decorator (runs with default configuration)
  // async defaultConfigTest({ page }: TestContext) {
  //   const viewport = page.viewportSize();
  //   console.log('Default test viewport:', viewport);
    
  //   await page.goto('https://example.com');
  //   await expect(page.locator('h1')).toContainText('Welcome');
  // }

  // Simple test to verify mobile configuration
  // @mobile
  // async simpleMobileTest({ page }: TestContext) {
  //   // This test just checks the viewport configuration
  //   const viewport = page.viewportSize();
  //   console.log('Simple mobile test - viewport:', viewport);
    
  //   // Navigate to a simple page
  //   await page.goto('https://httpbin.org/html');
    
  //   // Verify mobile viewport
  //   expect(viewport.width).toBe(375);
  //   expect(viewport.height).toBe(667);
    
  //   // Check that page loaded
  //   await expect(page.locator('h1')).toBeVisible();
  // }

  // Simple test to verify desktop configuration  
  // @desktop
  // async simpleDesktopTest({ page }: TestContext) {
  //   // This test just checks the viewport configuration
  //   const viewport = page.viewportSize();
  //   console.log('Simple desktop test - viewport:', viewport);
    
  //   // Navigate to a simple page
  //   await page.goto('https://httpbin.org/html');
    
  //   // Verify desktop viewport
  //   expect(viewport.width).toBe(1920);
  //   expect(viewport.height).toBe(1080);
    
  //   // Check that page loaded
  //   await expect(page.locator('h1')).toBeVisible();
  // }
}

// Register all tests from the class
registerTests(ResponsiveTests);
