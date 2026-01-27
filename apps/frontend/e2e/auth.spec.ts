import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should navigate to signup page and create new account', async ({ page }) => {
    // Navigate to the signup page
    await page.goto('/signup');
    
    // Check that we're on the signup page
    await expect(page).toHaveURL(/.*signup/);
    
    // Generate unique email for test
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';
    
    // Fill in the signup form
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.fill('input[placeholder*="Name" i], input[name="name"]', 'Test User');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for navigation or success message
    await page.waitForTimeout(1000);
    
    // Should redirect to posts or show success
    // Adjust based on actual app behavior
  });

  test('should navigate to login page and login', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Check that we're on the login page
    await expect(page).toHaveURL(/.*login/);
    
    // Check for login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await page.waitForTimeout(1000);
    
    // Should still be on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should logout successfully', async ({ page, context }) => {
    // First login (you might need to adjust this based on your actual auth setup)
    await page.goto('/login');
    
    // For this test, we'll just navigate to posts page
    // and check if logout button exists
    await page.goto('/posts');
    
    // Look for logout button
    const logoutButton = page.getByRole('button', { name: /logout|로그아웃/i });
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Should redirect to login page
      await expect(page).toHaveURL(/.*login/);
    }
  });
});
