import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { NotificationModal } from '../helpers/dashboard-pages.ts';
import { createAndPublishWhatsNewPage } from '../helpers/neos-ui.ts';

const { When, Then } = createBdd();

Then('the New features dialog should be visible', async ({ page }) => {
  await expect(new NotificationModal(page).dialog()).toBeVisible();
});

Then('the New features dialog should not be visible', async ({ page }) => {
  // The dialog is rendered by the UI plugin after an async fetch of
  // /api/whats-new/in-project. Give the plugin a moment to (not) show it, so
  // this negative assertion doesn't pass just because the UI hasn't booted yet.
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await expect(new NotificationModal(page).dialog()).toHaveCount(0);
});

When('I close the New features dialog', async ({ page }) => {
  await new NotificationModal(page).close();
});

When('I follow the {string} link in the dialog', async ({ page }, name: string) => {
  await new NotificationModal(page).followLink(name);
});

Then('the {string} cookie should be set', async ({ page }, cookieName: string) => {
  const cookies = await page.context().cookies();
  const cookie = cookies.find((c) => c.name === cookieName);
  expect(cookie, `expected cookie "${cookieName}" to be set`).toBeTruthy();
  expect(Number(cookie!.value)).toBeGreaterThan(0);
});

When("a What's New Dashboard Page with a future notification date is published", async ({ page }) => {
  await createAndPublishWhatsNewPage(page);
});
