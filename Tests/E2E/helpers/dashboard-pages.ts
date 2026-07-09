import type { Page } from '@playwright/test';

/**
 * The "What's new" backend module overview (route: /neos/whats-new).
 * Renders one tile (`.widget`) per submodule; currently "In your project".
 */
export class WhatsNewModulePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/neos/whats-new');
  }

  /** The tile (widget) whose header links to the submodule with the given label. */
  tile(label: string) {
    return this.page.locator('.widget', {
      has: this.page.getByRole('link', { name: label }),
    });
  }

  async clickTile(label: string) {
    await this.page.getByRole('link', { name: label }).click();
  }
}

/**
 * The "In your project" submodule (route: /neos/whats-new/in-project).
 * Shows `iframe#whatsNewIFrame` pointing at the configured `inProjectSourceUrl`,
 * or the text "Source url was not set." when the setting is empty.
 */
export class InProjectPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/neos/whats-new/in-project');
  }

  iframe() {
    return this.page.locator('iframe#whatsNewIFrame');
  }

  /** FrameLocator for asserting content INSIDE the news iframe. */
  frame() {
    return this.page.frameLocator('#whatsNewIFrame');
  }
}

/**
 * The "New features" notification dialog, injected into the Neos UI
 * (/neos/content) by the BackendModal UI plugin. It is shown whenever the
 * `whatsNewNoteClosedTimestamp` cookie is missing or older than the
 * `clientNotificationTimestamp` reported by /api/whats-new/in-project.
 */
export class NotificationModal {
  constructor(private readonly page: Page) {}

  /** The Dialog component is rendered with className "whats-new__dialog". */
  dialog() {
    return this.page.locator('.whats-new__dialog');
  }

  async close() {
    await this.dialog().getByRole('button', { name: 'Close' }).click();
  }

  async followLink(name: string) {
    await this.dialog().getByRole('link', { name }).click();
  }
}
