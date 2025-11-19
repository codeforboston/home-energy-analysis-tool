import { test, expect } from '@playwright/test'

// Test: Unauthenticated user is redirected to login for /cases and /cases/new

test.describe('Authentication required for /cases routes', () => {
  test('redirects /cases to login if not authenticated', async ({ page }) => {
    await page.goto('/cases')
    await expect(page).toHaveURL(/login/)
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
    await expect(page.getByRole('textbox', { name: /username/i })).toBeVisible()
  })

  test('redirects /cases/new to login if not authenticated', async ({ page }) => {
    await page.goto('/cases/new')
    await expect(page).toHaveURL(/login/)
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
    await expect(page.getByRole('textbox', { name: /username/i })).toBeVisible()
  })
})
