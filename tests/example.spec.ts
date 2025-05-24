import { expect } from '@playwright/test';
import { mobile, desktop, skip, registerTests, london, newyork } from './decorators';

// Define interface for test context
interface TestContext {
  page: any;
  context?: any;
  browser?: any;
}

class ResponsiveTests {

  // Verify the viewport is set correctly
  @mobile
  async mobileViewportTest({ page }: TestContext) {
    const viewport = page.viewportSize();
    expect(viewport.width).toBe(375);
    expect(viewport.height).toBe(667);
  }

  // Verify the viewport is set correctly
  @london
  @desktop
  async desktopViewportTest({ page }: TestContext) {
    const viewport = page.viewportSize();
    expect(viewport.width).toBe(1920);
    expect(viewport.height).toBe(1080);

    // Navigate to OpenWeatherMap
    await page.goto('https://openweathermap.org/');

    // Get the location displayed on the page
    const locationElement = await page.locator('.current-container.mobile-padding h2');
    const displayedLocation = await locationElement.textContent();

    // Assert that the displayed location includes "London, GB"
    expect(displayedLocation).toContain('London, GB');
  }

  // This test will be skipped during execution
  @skip
  async skippedTest({ page }: TestContext) {
    await page.goto('https://example.com/broken-feature');
    await expect(page.locator('.broken-element')).toBeVisible();
  }

  async defaultConfigTest({ page }: TestContext) {
    const viewport = page.viewportSize();
    expect(viewport.width).toBe(1280);
    expect(viewport.height).toBe(720);
  }
}

// Register all tests from the class
registerTests(ResponsiveTests);
