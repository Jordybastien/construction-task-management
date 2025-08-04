import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Login Page', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    helpers = new TestHelpers(page);

    // Clear all data before each test
    await helpers.clearAppData();
  });

  test.describe('Login Form', () => {
    test('should display login form elements', async () => {
      await loginPage.goto();

      await loginPage.expectToBeOnLoginPage();
      await loginPage.expectNameInputToBeVisible();
      await loginPage.expectSignInButtonToBeVisible();
    });

    test('should show validation error for empty name', async () => {
      await loginPage.goto();
      await loginPage.clickSignIn();

      const nameInput = loginPage.page.locator(loginPage.nameInput);
      await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    });

    test('should show validation error for name too short', async () => {
      await loginPage.goto();

      // Fill name with single character
      await loginPage.fillName('A');
      await loginPage.clickSignIn();

      // Should show validation error
      const errorMessage = loginPage.page.locator('[data-slot="form-message"]');
      await expect(errorMessage).toBeVisible();
    });
  });

  test.describe('Successful Login', () => {
    test('should login successfully with valid name', async () => {
      await loginPage.goto();

      const testUserName = 'John Doe';
      await loginPage.fillName(testUserName);
      await loginPage.clickSignIn();

      // Should navigate to home page
      await loginPage.expectSuccessfulLogin();
      await homePage.expectToBeOnHomePage();
      await homePage.expectUserToBeLoggedIn();
    });

    test('should persist login state after page refresh', async () => {
      await loginPage.goto();
      await loginPage.login('Persistent User');

      // Refresh the page
      await loginPage.page.reload();
      await helpers.waitForAppReady();

      // Should still be logged in
      await homePage.expectToBeOnHomePage();
      await homePage.expectUserToBeLoggedIn();
    });
  });

  test.describe('Navigation', () => {
    test('should redirect to login when not authenticated', async () => {
      await homePage.goto();

      await expect(loginPage.page).toHaveURL('/');
    });

    test('should redirect to home when already authenticated', async () => {
      await loginPage.goto();
      await loginPage.login('Authenticated User');

      await loginPage.goto();
      await expect(loginPage.page).toHaveURL('/home');
    });
  });

  test.describe('Form Interaction', () => {
    test('should allow typing in name input', async () => {
      await loginPage.goto();

      const testName = 'Interactive User';
      await loginPage.fillName(testName);

      await loginPage.expectNameInputToHaveValue(testName);
    });

    test('should clear validation errors when typing', async () => {
      await loginPage.goto();

      // Trigger validation error
      await loginPage.fillName('A');
      await loginPage.clickSignIn();

      // Clear and type valid name
      await loginPage.fillName('Valid User Name');

      // Error should be cleared
      const errorMessage = loginPage.page.locator('[data-slot="form-message"]');
      await expect(errorMessage).not.toBeVisible();
    });

    test('should handle Enter key to submit form', async () => {
      await loginPage.goto();

      await loginPage.fillName('Enter Key User');
      await loginPage.page.keyboard.press('Enter');

      await loginPage.expectSuccessfulLogin();
    });
  });
});
