import { test, expect } from '@playwright/test';

test('[TC-0001] User signs in with Keycloak and the UI is displayed correctly', async ({ page }) => {
  // Navigate to the website from ACCESSNOW_HOST environment variable
  const accessnowHost = process.env.ACCESSNOW_HOST || '';
  await page.goto(accessnowHost);

  // Verify that the URL starts from AUTH_HOST environment variable
  const authHost = process.env.AUTH_HOST || '';
  await expect
    .poll(() => page.url(), { timeout: 15000 })
    .toMatch(new RegExp(`^${authHost.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));

  // Fill in the username textbox using TEST_USERNAME environment variable
  const testUsername = process.env.TEST_USERNAME || '';
  await page.fill('input[type="text"]', testUsername);

    // Click the "Sign In " button
  await page.click('button:has-text("Sign In ")');

  // Wait for the password text to appear
  await page.waitForSelector('input[type="password"]');

  // Fill in the password textbox using TEST_USER_PASSWORD environment variable
  const testUserPassword = process.env.TEST_USER_PASSWORD || '';
  await page.fill('input[type="password"]', testUserPassword);

  // Click the "Sign In" button
  await page.click('button:has-text("Sign In")');

  // Verify that the browser loads website starting from ACCESSNOW_HOST
  await page.waitForURL(new RegExp(`${accessnowHost}`));
});

