import { Page, expect } from '@playwright/test';

/**
 * Test utilities
 */

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for the application to be ready
   */
  async waitForAppReady() {
    try {
      await this.page.waitForSelector('body', { timeout: 10000 });

      await this.page
        .waitForFunction(
          () => {
            const loadingElements = document.querySelectorAll(
              '[data-testid*="loading"], [data-testid*="skeleton"], .loading, [class*="loading"]'
            );
            return loadingElements.length === 0;
          },
          { timeout: 5000 }
        )
        .catch(() => {
          console.log('Some loading elements may still be present');
        });
    } catch (error) {
      console.warn('Error waiting for app ready:', error);
    }
  }

  /**
   * Perform login with just a name
   */
  async login(name = 'Test User') {
    await this.page.goto('/');
    await this.page.fill('input[name="name"]', name);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL('/home');
    await this.waitForAppReady();
  }

  /**
   * Clear all application data
   */
  async clearAppData() {
    await this.page.evaluate(() => {
      try {
        if (window.localStorage) {
          localStorage.clear();
        }
      } catch (error) {
        console.warn('Could not clear localStorage:', error);
      }

      try {
        // Clear IndexedDB databases
        if ('indexedDB' in window) {
          indexedDB.deleteDatabase('rxdb-construction-task-manager');
        }
      } catch (error) {
        console.warn('Could not clear IndexedDB:', error);
      }
    });
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const userStore = await this.page.evaluate(() => {
        try {
          return localStorage.getItem('construction_management:user');
        } catch (error) {
          console.warn('Could not access localStorage:', error);
          return null;
        }
      });
      return !!userStore;
    } catch (error) {
      console.warn('Error checking login status:', error);
      return false;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    await this.clearAppData();
    await this.page.goto('/');
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(url?: string) {
    if (url) {
      await this.page.waitForURL(url);
    }
    await this.waitForAppReady();
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, {
        state: 'visible',
        timeout: 2000,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get text content safely
   */
  async getText(selector: string): Promise<string> {
    const element = await this.page.waitForSelector(selector);
    return (await element.textContent()) || '';
  }

  /**
   * Wait for toast notification
   */
  async waitForToast(message?: string, timeout = 5000) {
    const toastSelector =
      '[data-testid="toast"], .sonner-toast, [data-sonner-toast]';
    await this.page.waitForSelector(toastSelector, { timeout });

    if (message) {
      const toastText = await this.getText(toastSelector);
      expect(toastText).toContain(message);
    }
  }

  /**
   * Wait for and click element
   */
  async clickElement(selector: string) {
    await this.page.waitForSelector(selector, { state: 'visible' });
    await this.page.click(selector);
  }

  /**
   * Fill form field
   */
  async fillField(selector: string, value: string) {
    await this.page.waitForSelector(selector, { state: 'visible' });
    await this.page.fill(selector, value);
  }

  /**
   * Take screenshot with name
   */
  async screenshot(name: string) {
    await this.page.screenshot({
      path: `e2e/screenshots/${name}.png`,
      fullPage: true,
    });
  }
}
