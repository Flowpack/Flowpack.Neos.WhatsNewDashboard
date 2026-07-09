import { expect, type Page } from '@playwright/test';

/**
 * Create a "What's New Dashboard Page" document via the Neos UI page tree, set
 * its `clientNotificationDateTime` through the inspector and publish it, so that
 * /api/whats-new/in-project (provided by the companion package
 * flowpack/neos-whatsneweditor-inmyproject) reports a fresh clientNotificationTimestamp.
 *
 * NOTE: the node type label uses a typographic apostrophe: "What’s New Dashboard Page".
 */
export async function createAndPublishWhatsNewPage(page: Page) {
  await page.goto('/neos/content');
  await page.waitForLoadState('networkidle');

  // Focus the site root ("Home") in the page tree, then open the "Create new"
  // dialog from the tree toolbar. The E2E-SUT NodeTypes.yaml override allows the
  // What's New page type below ANY demo document, so the test does not depend on
  // which insert position (above/below/inside) the dialog opens with.
  await page.getByRole('treeitem', { name: 'Home' }).first().click();
  await page.locator('#neos-PageTree-AddNode').click();

  // Pick the node type from the insert dialog (grouped under "What's new dashboard elements").
  await page.getByRole('button', { name: 'What’s New Dashboard Page' }).click();

  // The document creation dialog asks for a title.
  const titleInput = page.locator('#neos-NodeCreationDialog-Body input');
  await titleInput.fill('E2E What is new');
  await page.locator('#neos-NodeCreationDialog-CreateNew').click();

  // Wait for the new page to be created and loaded in the content canvas.
  await page.waitForLoadState('networkidle');

  // Set `clientNotificationDateTime` through the inspector, as an editor would:
  // the node type declares `defaultValue: now`, but that default is NOT applied
  // on creation through the UI (the property simply stays unset and the API
  // reports timestamp 0). Pick TOMORROW in the date picker — the editor has
  // minute resolution, so "today" could floor to a time before the dismissal
  // cookie was written; tomorrow is always after it.
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  // Day numbers of adjacent months also appear in the calendar grid (as
  // .rdtOld/.rdtNew cells), so scope to the current month — unless tomorrow IS
  // in the next month, then pick its .rdtNew cell.
  const dayCell =
    tomorrow.getMonth() === today.getMonth()
      ? page.locator(`.rdtPicker td.rdtDay:not(.rdtOld):not(.rdtNew)[data-value="${tomorrow.getDate()}"]`)
      : page.locator(`.rdtPicker td.rdtDay.rdtNew[data-value="${tomorrow.getDate()}"]`).first();

  // The date editor renders a readonly "fake input" covered by a mirror div
  // that receives all pointer events — click the mirror to open the picker.
  // (Class names are CSS-module-hashed, so match by suffix.)
  // Right after the document creation the inspector may still remount while the
  // canvas loads the new page (observed on Neos 9): the picker then closes
  // underneath us and the selection is lost. Verify the value actually
  // committed and retry the whole interaction otherwise.
  const dateInput = page.locator('[id="__neos__editor__property---clientNotificationDateTime"]');
  let committed = false;
  for (let attempt = 0; attempt < 3 && !committed; attempt++) {
    await page.locator('[class*="calendarFakeInputMirror"]').click();
    try {
      await dayCell.click({ timeout: 3000 });
      await expect(dateInput).not.toHaveValue('', { timeout: 3000 });
      committed = true;
    } catch {
      // picker closed underneath us (inspector remount) — try again
    }
  }
  if (!committed) {
    throw new Error('Could not set clientNotificationDateTime via the inspector date picker');
  }
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.waitForLoadState('networkidle');

  // Publish the change set (new document + property) so the node reaches "live"
  // (the API endpoint only looks at the live workspace).
  await page.locator('#neos-PublishDropDown-Publish').click();
  await page.waitForLoadState('networkidle');

  // Publishing finished when the button returns to its empty state: disabled
  // (nothing left to publish) and no longer marked "highlighted" (while pending
  // changes exist it is enabled + highlighted; during publishing disabled + highlighted).
  const publishButton = page.locator('#neos-PublishDropDown-Publish');
  await expect(publishButton).toBeDisabled();
  await expect(publishButton).not.toHaveClass(/highlighted/);
}
