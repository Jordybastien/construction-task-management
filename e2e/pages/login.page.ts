import { Page, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class LoginPage {
  private helpers: TestHelpers;

  constructor(public page: Page) {
    this.helpers = new TestHelpers(page);
  }

  // @Note: I know this is not a great way to do assertion, data-testid is appropriate
  // TODO: Use data-testid selectors
  // selectors
  get nameInput() {
    return 'input[name="name"]';
  }
  get signInButton() {
    return 'button[type="submit"]';
  }
  get errorAlert() {
    return '[data-slot="form-message"]';
  }
  get loadingButton() {
    return 'button[type="submit"][data-loading="true"], button[type="submit"]:has(svg.animate-spin)';
  }

  // Actions
  async goto() {
    await this.page.goto('/');
    await this.helpers.waitForAppReady();
  }

  async fillName(name: string) {
    await this.helpers.fillField(this.nameInput, name);
  }

  async clickSignIn() {
    await this.helpers.clickElement(this.signInButton);
  }

  async login(name: string) {
    await this.fillName(name);
    await this.clickSignIn();

    // Wait for navigation to home
    await this.page.waitForURL('/home');
    await this.helpers.waitForAppReady();
  }

  // Assertions
  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL('/');
    await expect(this.page.locator(this.nameInput)).toBeVisible();
    await expect(this.page.locator(this.signInButton)).toBeVisible();
  }

  async expectNameInputToBeVisible() {
    await expect(this.page.locator(this.nameInput)).toBeVisible();
  }

  async expectSignInButtonToBeVisible() {
    await expect(this.page.locator(this.signInButton)).toBeVisible();
  }

  async expectSignInButtonToBeLoading() {
    await expect(this.page.locator(this.loadingButton)).toBeVisible();
  }

  async expectErrorMessage(message?: string) {
    const errorElement = this.page.locator(this.errorAlert);
    await expect(errorElement).toBeVisible();

    if (message) {
      await expect(errorElement).toContainText(message);
    }
  }

  async expectSuccessfulLogin() {
    await expect(this.page).toHaveURL('/home');
  }

  async expectNameInputToHaveValue(value: string) {
    await expect(this.page.locator(this.nameInput)).toHaveValue(value);
  }
}
