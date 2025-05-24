# Decorators with Playwright

A TypeScript project demonstrating the use of custom decorators to simplify and enhance Playwright end-to-end (E2E) testing. This project provides decorators for device-specific test execution (mobile, desktop), skipping tests, and easy test registration using a class-based approach.

## Features

- **Device Decorators:**
  - `@mobile` and `@desktop` decorators to run tests with device-specific configurations (viewport, user agent, touch, etc).
- **Location Decorators:**
  - `@london` and `@newyork` decorators to run tests with location-specific configurations.
- **Skip Decorator:**
  - `@skip` decorator to temporarily disable tests.
- **Class-based Test Registration:**
  - Easily group and register tests using classes and decorators.
- **Manual and Automatic Registration:**
  - Register tests via class (`registerTests`) or individually (`createConfiguredTest`).
- **Strongly-Typed Decorator Context:**
  - All internal decorator helpers use a strict `DecoratorContext` interface for type safety and clarity.
- **Playwright Integration:**
  - Uses Playwright's configuration and device/location emulation for robust cross-device/location testing.

## Project Structure

```
/ (root)
├── configs/
│   ├── device-configs.ts         # Device configuration constants
│   └── location-configs.ts       # Location configuration constants
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── tests/
    ├── decorators.ts                 # Core decorators and helpers (now imports device/location configs)
    ├── decorator-context.interface.ts # Strongly-typed interface for decorator context
    ├── example.spec.ts               # Example: Class-based tests with decorators
    └── alternative-usage.ts          # Example: Manual/static method registration
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests

```bash
npx playwright test
```

### 3. View Test Reports

After running tests, open the HTML report:

```bash
npx playwright show-report
```

## Usage Example

See `tests/example.spec.ts` for a class-based approach, or `tests/alternative-usage.ts` for manual registration.

```typescript
import { mobile, desktop, skip, london, newyork, registerTests } from './decorators';

class ResponsiveTests {
  @mobile
  async mobileViewportTest({ page }: TestContext) {
    const viewport = page.viewportSize();
    expect(viewport.width).toBe(375);
    expect(viewport.height).toBe(667);
  }

  @desktop
  async desktopViewportTest({ page }: TestContext) {
    const viewport = page.viewportSize();
    expect(viewport.width).toBe(1920);
    expect(viewport.height).toBe(1080);
    await page.goto('https://openweathermap.org/');
    const locationElement = await page.locator('.current-container.mobile-padding h2');
    const displayedLocation = await locationElement.textContent();
    expect(displayedLocation).toContain('London, GB');
  }

  @skip
  async skippedTest({ page }: TestContext) {
    // ...
  }
}

registerTests(ResponsiveTests);
```

### Strongly-Typed Decorator Context

All internal decorator helpers use the `DecoratorContext` interface (see `tests/decorator-context.interface.ts`).

```typescript
export interface DecoratorContext {
  kind: 'method' | string;
  name?: string;
  metadata: any;
  addInitializer: [Function];
  static: boolean;
  private: boolean;
  access: { has: [Function], get: [Function] };
}
```

This provides type safety and clarity for all custom decorator logic.

### Manual Registration for Static Methods

```typescript
import { createConfiguredTest, mobile, desktop, skip } from './decorators';

class IndividualTests {
  @mobile
  static async quickMobileTest({ page }) { /* ... */ }

  @desktop
  static async quickDesktopTest({ page }) { /* ... */ }

  @skip
  static async temporarilyDisabledTest({ page }) { /* ... */ }
}

createConfiguredTest(IndividualTests.quickMobileTest, 'Quick Mobile Test');
createConfiguredTest(IndividualTests.quickDesktopTest, 'Quick Desktop Test');
createConfiguredTest(IndividualTests.temporarilyDisabledTest, 'Temporarily Disabled Test');
```

## Configuration

- Edit `playwright.config.ts` to customize device settings, test directory, and reporting.
- Decorators use Playwright's built-in device descriptors for mobile/desktop emulation.

## Requirements

- Node.js >= 18
- Playwright >= 1.52
- TypeScript >= 5.8

## License

ISC
