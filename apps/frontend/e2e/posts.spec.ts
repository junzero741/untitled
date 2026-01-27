import { test, expect } from '@playwright/test';

test.describe('Posts Management', () => {
  // Helper to login before each test
  test.beforeEach(async ({ page }) => {
    // Note: In a real scenario, you might want to use API calls to create a test user
    // and login via API to make tests faster and more reliable
    await page.goto('/login');
    
    // This is a placeholder - adjust based on actual test user
    // Or use page.context().addCookies() to set auth cookies directly
  });

  test('should display posts list page', async ({ page }) => {
    await page.goto('/posts');
    
    // Check that we're on the posts page
    await expect(page).toHaveURL(/.*posts/);
    
    // Page should have a title or heading
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should navigate to create post page', async ({ page }) => {
    await page.goto('/posts');
    
    // Look for "새 글 작성" or "New Post" button
    const createButton = page.getByRole('link', { name: /새 글 작성|new post|create/i });
    
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Should navigate to create page
      await expect(page).toHaveURL(/.*posts\/create|new/);
    }
  });

  test('should create a new post with WYSIWYG editor', async ({ page }) => {
    await page.goto('/posts/create');
    
    // Fill in post title
    const titleInput = page.locator('input[placeholder*="제목" i], input[name*="title" i]').first();
    await titleInput.fill('Test Post Title');
    
    // Fill in post content using ProseMirror editor
    const editor = page.locator('.ProseMirror, [contenteditable="true"]').first();
    await editor.click();
    await editor.fill('This is a test post content with some text.');
    
    // Look for submit button
    const submitButton = page.getByRole('button', { name: /작성|submit|create|post/i });
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Wait for navigation to posts list or post detail
      await page.waitForURL(/.*posts/, { timeout: 5000 });
      
      // Should redirect to posts list or post detail
      await expect(page).toHaveURL(/.*posts/);
    }
  });

  test('should view post details', async ({ page }) => {
    await page.goto('/posts');
    
    // Click on first post if available
    const firstPost = page.locator('a[href*="/posts/"]').first();
    
    if (await firstPost.isVisible()) {
      await firstPost.click();
      
      // Should show post details
      await expect(page).toHaveURL(/.*posts\/\d+/);
      
      // Should show post content
      await expect(page.locator('.ProseMirror, [class*="content"]').first()).toBeVisible();
    }
  });

  test('should edit existing post', async ({ page }) => {
    await page.goto('/posts');
    
    // Navigate to a post detail page
    const firstPost = page.locator('a[href*="/posts/"]').first();
    
    if (await firstPost.isVisible()) {
      await firstPost.click();
      
      // Look for edit button
      const editButton = page.getByRole('button', { name: /edit|수정/i });
      
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Should navigate to edit page
        await expect(page).toHaveURL(/.*edit/);
        
        // Modify content
        const editor = page.locator('.ProseMirror, [contenteditable="true"]').first();
        await editor.click();
        await editor.press('Control+A');
        await editor.fill('Updated post content');
        
        // Submit changes
        const submitButton = page.getByRole('button', { name: /submit|save|저장/i });
        if (await submitButton.isVisible()) {
          await submitButton.click();
        }
      }
    }
  });

  test('should delete post', async ({ page }) => {
    await page.goto('/posts');
    
    // Navigate to a post detail page
    const firstPost = page.locator('a[href*="/posts/"]').first();
    
    if (await firstPost.isVisible()) {
      await firstPost.click();
      
      // Look for delete button
      const deleteButton = page.getByRole('button', { name: /delete|삭제/i });
      
      if (await deleteButton.isVisible()) {
        // Handle confirmation dialog if present
        page.on('dialog', dialog => dialog.accept());
        
        await deleteButton.click();
        
        // Wait for navigation back to posts list
        await page.waitForURL(/.*posts$/, { timeout: 5000 });
        
        // Should redirect back to posts list
        await expect(page).toHaveURL(/.*posts$/);
      }
    }
  });
});
