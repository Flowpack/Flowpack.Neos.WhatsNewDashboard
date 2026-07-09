import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { WhatsNewModulePage, InProjectPage } from '../helpers/dashboard-pages.ts';

const { When, Then } = createBdd();

// ── Navigation ────────────────────────────────────────────────────────────────

When('I open the Neos menu', async ({ page }) => {
  await page.locator('#neos-MenuToggler').click();
});

When("I open the What's new module overview", async ({ page }) => {
  await new WhatsNewModulePage(page).goto();
});

When('I open the In your project module', async ({ page }) => {
  await new InProjectPage(page).goto();
});

When('I click the {string} tile', async ({ page }, label: string) => {
  await new WhatsNewModulePage(page).clickTile(label);
});

// ── Assertions ────────────────────────────────────────────────────────────────

Then('I should see the {string} menu entry', async ({ page }, label: string) => {
  await expect(page.getByRole('link', { name: label })).toBeVisible();
});

Then('I should see the {string} tile', async ({ page }, label: string) => {
  await expect(new WhatsNewModulePage(page).tile(label)).toBeVisible();
});

Then('I should see the message {string}', async ({ page }, message: string) => {
  await expect(page.getByText(message)).toBeVisible();
});

Then('I should not see the message {string}', async ({ page }, message: string) => {
  await expect(page.getByText(message)).toHaveCount(0);
});

Then('the news iframe should not be present', async ({ page }) => {
  await expect(new InProjectPage(page).iframe()).toHaveCount(0);
});

Then('the news iframe should be visible', async ({ page }) => {
  await expect(new InProjectPage(page).iframe()).toBeVisible();
});

Then('the news iframe should point to {string}', async ({ page }, url: string) => {
  await expect(new InProjectPage(page).iframe()).toHaveAttribute('src', url);
});

Then('the news iframe should show content', async ({ page }) => {
  // Assert that the iframe actually loaded a document with rendered content
  // (the demo site homepage), not just that the element exists.
  await expect(new InProjectPage(page).frame().locator('body')).not.toBeEmpty();
});
