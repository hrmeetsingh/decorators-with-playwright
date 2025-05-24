# Decorators with Playwright

A TypeScript project demonstrating the use of custom decorators to simplify and enhance Playwright end-to-end (E2E) testing. This project provides decorators for device-specific test execution (mobile, desktop), skipping tests, and easy test registration using a class-based approach.

## Features

- **Device Decorators:**
  - `@mobile` and `@desktop` decorators to run tests with device-specific configurations (viewport, user agent, touch, etc).
- **Skip Decorator:**
  - `@skip` decorator to temporarily disable tests.
- **Class-based Test Registration:**
  - Easily group and register tests using classes and decorators.
- **Manual and Automatic Registration:**
  - Register tests via class (`registerTests`) or individually (`createConfiguredTest`).
- **Playwright Integration:**
  - Uses Playwright's configuration and device emulation for robust cross-device testing.

## Project Structure

```
/ (root)
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── tests/
    ├── decorators.ts            # Core decorators and helpers
    ├── example.spec.ts          # Example: Class-based tests with decorators
    └── alternative-usage.ts     # Example: Manual/static method registration
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

## Usage Examples

### Class-based Decorators

```typescript
import { mobile, desktop, skip, registerTests } from './decorators';

class ResponsiveTests {
  @mobile
  async mobileLoginTest({ page }) {
    // ...mobile test code
  }

  @desktop
  async desktopDashboardTest({ page }) {
    // ...desktop test code
  }

  @skip
  async temporarilyDisabledTest({ page }) {
    // ...skipped test code
  }
}

registerTests(ResponsiveTests);
```

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
