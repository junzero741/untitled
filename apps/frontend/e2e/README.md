# End-to-End Testing with Playwright

This directory contains end-to-end tests for the frontend application using [Playwright](https://playwright.dev/).

## Setup

Playwright is already installed as a dev dependency. To install the browser binaries, run:

```bash
cd apps/frontend
pnpm run playwright:install
```

## Running Tests

### Run all tests
```bash
pnpm run test:e2e
```

### Run tests in UI mode (interactive)
```bash
pnpm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
pnpm run test:e2e:headed
```

### Debug tests
```bash
pnpm run test:e2e:debug
```

### Run specific test file
```bash
pnpm exec playwright test auth.spec.ts
```

### Run tests in a specific browser
```bash
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit
```

## Test Structure

- `auth.spec.ts` - Authentication flow tests (signup, login, logout)
- `posts.spec.ts` - Post management tests (create, read, update, delete)
- `home.spec.ts` - Homepage and navigation tests

## Writing Tests

Tests use Playwright's test runner and assertions. Example:

```typescript
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

## Configuration

The Playwright configuration is in `playwright.config.ts`. Key settings:

- Tests run against `http://localhost:3000` by default
- The dev server is automatically started before tests
- Tests run in parallel
- Screenshots and traces are captured on failure

## CI/CD Integration

Playwright tests can be integrated into CI/CD pipelines. The configuration is optimized for CI with:

- Automatic retries on failure
- Single worker in CI mode
- HTML report generation

## Learn More

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-test)
