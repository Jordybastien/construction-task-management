import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Home Page', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    helpers = new TestHelpers(page);

    // Clear all data and login before each test
    await helpers.clearAppData();
    await loginPage.goto();
    await loginPage.login('Test User');
  });

  test.describe('Home Page Layout', () => {
    test('should display home page elements', async () => {
      await homePage.expectToBeOnHomePage();
      await homePage.expectCreateProjectButtonToBeVisible();
      await homePage.expectUserToBeLoggedIn();
    });

    test('should show create project button', async () => {
      await homePage.expectToBeOnHomePage();
      await homePage.expectCreateProjectButtonToBeVisible();
    });

    test('should display create project button prominently', async () => {
      await homePage.expectCreateProjectButtonToBeVisible();

      // Button should be clickable
      const createButton = homePage.page.locator(homePage.createProjectButton);
      await expect(createButton).toBeEnabled();
    });
  });

  test.describe('Project Management', () => {
    test('should create a new project', async () => {
      const initialProjectCount = await homePage.getProjectCount();

      await homePage.clickCreateProject();

      // Wait for create project modal/form
      await homePage.page.waitForSelector('input[name="name"]', {
        timeout: 5000,
      });

      const projectName = 'Test Project ' + Date.now();
      await homePage.page.fill('input[name="name"]', projectName);

      // Submit the form
      await homePage.page.click('button[type="submit"]');

      // Wait for project to be created
      await helpers.waitForAppReady();

      // Should show the new project
      await homePage.expectProjectToExist(projectName);

      // Project count should increase
      const newProjectCount = await homePage.getProjectCount();
      expect(newProjectCount).toBe(initialProjectCount + 1);
    });

    test('should display project cards with correct information', async () => {
      // Create a test project first
      await homePage.clickCreateProject();
      await homePage.page.waitForSelector('input[name="name"]');

      const projectName = 'Information Test Project';
      await homePage.page.fill('input[name="name"]', projectName);
      await homePage.page.click('button[type="submit"]');
      await helpers.waitForAppReady();

      // Check project card information
      await homePage.expectProjectToExist(projectName);
      // Project card should be visible with basic information
      const projectCard = homePage.page
        .locator(homePage.projectCards)
        .filter({ hasText: projectName });
      await expect(projectCard).toBeVisible();
    });

    test('should navigate to project details when clicking project card', async () => {
      // Create a test project
      await homePage.clickCreateProject();
      await homePage.page.waitForSelector('input[name="name"]');

      const projectName = 'Navigation Test Project';
      await homePage.page.fill('input[name="name"]', projectName);
      await homePage.page.click('button[type="submit"]');
      await helpers.waitForAppReady();

      // Click on the project card
      await homePage.clickProjectCard(projectName);

      // Should navigate to project details
      await expect(homePage.page).toHaveURL(/\/project\/[^\/]+/);
    });
  });

  test.describe('Project List Features', () => {
    test('should display projects when they exist', async () => {
      // Create a test project first
      await homePage.clickCreateProject();
      await homePage.page.waitForSelector('input[name="name"]');
      await homePage.page.fill('input[name="name"]', 'Test Project');
      await homePage.page.click('button[type="submit"]');
      await helpers.waitForAppReady();

      const projectCount = await homePage.getProjectCount();
      expect(projectCount).toBeGreaterThanOrEqual(1);

      await homePage.expectProjectToExist('Test Project');
    });

    test('should show project information in cards', async () => {
      // Create a project to test
      await homePage.clickCreateProject();
      await homePage.page.waitForSelector('input[name="name"]');
      const projectName = 'Stats Test Project';
      await homePage.page.fill('input[name="name"]', projectName);
      await homePage.page.click('button[type="submit"]');
      await helpers.waitForAppReady();

      const projectCard = homePage.page
        .locator(homePage.projectCards)
        .filter({ hasText: projectName });
      await expect(projectCard).toBeVisible();

      // Should contain project name
      await expect(projectCard).toContainText(projectName);
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async () => {
      await homePage.page.setViewportSize({ width: 375, height: 667 });
      await homePage.page.reload();
      await helpers.waitForAppReady();

      await homePage.expectToBeOnHomePage();
      await homePage.expectCreateProjectButtonToBeVisible();
    });

    test('should work on tablet viewport', async () => {
      await homePage.page.setViewportSize({ width: 768, height: 1024 });
      await homePage.page.reload();
      await helpers.waitForAppReady();

      await homePage.expectToBeOnHomePage();
      await homePage.expectCreateProjectButtonToBeVisible();
    });

    test('should work on desktop viewport', async () => {
      await homePage.page.setViewportSize({ width: 1920, height: 1080 });
      await homePage.page.reload();
      await helpers.waitForAppReady();

      await homePage.expectToBeOnHomePage();
      await homePage.expectCreateProjectButtonToBeVisible();
    });
  });

  test.describe('Data Persistence', () => {
    test('should persist projects after page refresh', async () => {
      // Create a project
      await homePage.clickCreateProject();
      await homePage.page.waitForSelector(
        'input[name="name"], input[placeholder*="name"]'
      );

      const projectName = 'Persistence Test Project';
      await homePage.page.fill(
        'input[name="name"], input[placeholder*="name"]',
        projectName
      );
      await homePage.page.click('button[type="submit"]');
      await helpers.waitForAppReady();

      // Refresh page
      await homePage.page.reload();
      await helpers.waitForAppReady();

      // Project should still exist
      await homePage.expectProjectToExist(projectName);
    });
  });
});
