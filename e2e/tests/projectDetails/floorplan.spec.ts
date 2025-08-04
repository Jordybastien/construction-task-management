import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { HomePage } from '../../pages/home.page';
import { ProjectDetailsPage } from '../../pages/projectDetails.page';
import { TestHelpers } from '../../utils/test-helpers';

test.describe('Project Details - Floor Plan View', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let projectDetailsPage: ProjectDetailsPage;
  let helpers: TestHelpers;
  let testProjectId: string;

  test.beforeAll(async ({ browser }) => {
    // Create a project for all tests to use
    const page = await browser.newPage();
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const helper = new TestHelpers(page);

    await helper.clearAppData();
    await login.goto();
    await login.login('Floor Plan Test User');

    // Create a test project
    await home.clickCreateProject();
    await page.waitForSelector('input[name="name"]');
    await page.fill('input[name="name"]', 'Floor Plan Test Project');
    await page.click('button[type="submit"]');
    await helper.waitForAppReady();

    // CRITICAL: Wait for project creation to complete and floor plan to be created
    await page.waitForTimeout(3000);

    // Navigate to home to see the project
    await page.goto('/home');
    await helper.waitForAppReady();

    // Extract project ID from URL after navigation
    await home.clickProjectCard('Floor Plan Test Project');
    const currentUrl = page.url();
    testProjectId = currentUrl.split('/project/')[1];

    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    projectDetailsPage = new ProjectDetailsPage(page);
    helpers = new TestHelpers(page);

    // await helpers.clearAppData();

    await loginPage.goto();
    await loginPage.login('Floor Plan Test User');

    await page.waitForTimeout(2000);

    await projectDetailsPage.goto(testProjectId);
    await projectDetailsPage.switchToFloorPlanView();
  });

  test.describe('Floor Plan Layout', () => {
    test('should display floor plan view elements', async () => {
      await projectDetailsPage.expectToBeOnProjectDetailsPage(
        testProjectId,
        'floor_plan'
      );
      await projectDetailsPage.expectViewToggleToBeVisible();
      await projectDetailsPage.expectFloorPlanViewToBeActive();
    });

    test('should show floor plan image', async () => {});

    test('should show room polygons if they exist', async () => {});
  });

  test.describe('Task Creation on Floor Plan', () => {
    test('should create task by clicking on floor plan', async () => {});

    test('should place task marker on floor plan after creation', async () => {});
  });

  test.describe('Task Interaction', () => {
    test('should display task details when clicking task card', async () => {});

    test('should allow editing task from floor plan view', async () => {});
  });

  test.describe('View Switching', () => {
    test('should switch between floor plan and kanban views', async () => {});

    test('should preserve tasks when switching views', async () => {});
  });

  test.describe('Responsive Floor Plan', () => {
    test('should work on mobile viewport', async () => {});

    test('should work on tablet viewport', async () => {});
  });
});
