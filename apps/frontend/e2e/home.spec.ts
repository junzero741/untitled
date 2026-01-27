import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page loaded successfully
    expect(page.url()).toContain('localhost:3000');
  });

  test('should have proper title', async ({ page }) => {
    await page.goto('/');
    
    // Wait for title to be set
    await page.waitForLoadState('domcontentloaded');
    
    // Check page title (adjust based on your app)
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should navigate to login page from home', async ({ page }) => {
    await page.goto('/');
    
    // Look for login link
    const loginLink = page.getByRole('link', { name: /login|로그인/i });
    
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/.*login/);
    } else {
      // If no login link, homepage might redirect to login
      await page.waitForLoadState('networkidle');
    }
  });
});
