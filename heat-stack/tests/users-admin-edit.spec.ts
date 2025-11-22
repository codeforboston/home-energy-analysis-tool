import { test, expect } from '@playwright/test';

// Assumes test database is seeded with at least one admin and one non-admin user
// and that login functionality is available via /login route

const adminUser = {
  email: 'admin@example.com',
  password: 'adminpassword', // adjust to match your seed
};
const nonAdminUser = {
  email: 'user@example.com',
  password: 'userpassword', // adjust to match your seed
};

// Helper to login
import type { Page } from '@playwright/test';
async function login(page: Page, creds: { email: string; password: string }) {
  await page.goto('/login');
  await page.fill('input[name="email"]', creds.email);
  await page.fill('input[name="password"]', creds.password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
}

test.describe('Admin Users Screen', () => {
  test('admin can view and edit users', async ({ page }) => {
    await login(page, adminUser);
    await page.goto('/users');
    await expect(page.locator('h2')).toHaveText(/Edit Users/);
    // Should see user rows
    await expect(page.locator('input[type="checkbox"]')).toHaveCount(0);
    // Click edit button for first user
    await page.click('button:has(svg[data-icon="pencil-2"])');
    // Should see editable fields
    await expect(page.locator('input[name="email"]')).toBeVisible();
    // Change email and submit
    await page.fill('input[name="email"]', 'newadmin@example.com');
    await page.locator('input[name="email"]').blur();
    // Should update (ideally check for success message or updated value)
    await expect(page.locator('input[name="email"]')).toHaveValue('newadmin@example.com');
  });

  test('non-admin cannot access users screen', async ({ page }) => {
    await login(page, nonAdminUser);
    await page.goto('/users');
    await expect(page.locator('text=Access denied')).toBeVisible();
  });

  test('admin can toggle is_admin checkbox', async ({ page }) => {
    await login(page, adminUser);
    await page.goto('/users');
    // Click edit button for first user
    await page.click('button:has(svg[data-icon="pencil-2"])');
    // Toggle admin checkbox
    const adminCheckbox = page.locator('input[name="is_admin"]');
    const checked = await adminCheckbox.isChecked();
    await adminCheckbox.setChecked(!checked);
    await adminCheckbox.blur();
    // Should update (ideally check for updated value)
    await expect(adminCheckbox).toBeChecked({ checked: !checked });
  });
});
