import { Page, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class HomePage {
  private helpers: TestHelpers;

  constructor(public page: Page) {
    this.helpers = new TestHelpers(page);
  }

  // @Note: I know this is not a great way to do assertion, data-testid is appropriate
  // TODO: Use data-testid selectors
  // Selectors
  get createProjectButton() {
    return 'button:has-text("Create Project")';
  }
  get projectCards() {
    return '.group.cursor-pointer, .cursor-pointer.transition';
  }
  get emptyState() {
    return 'div:has-text("No projects")';
  }
  get loadingSkeletons() {
    return '.cursor-pointer.transition.ease-in-out .h-6';
  }
  get searchInput() {
    return 'input[placeholder*="Search"]';
  }
  get userAvatar() {
    return 'button';
  }

  // Actions
  async goto() {
    await this.page.goto('/home');
    await this.helpers.waitForAppReady();
  }

  async clickCreateProject() {
    await this.helpers.clickElement(this.createProjectButton);
  }

  async clickProjectCard(projectName: string) {
    const projectCard = this.page
      .locator(this.projectCards)
      .filter({ hasText: projectName });
    await projectCard.click();
  }

  async searchProjects(searchTerm: string) {
    if (await this.helpers.isVisible(this.searchInput)) {
      await this.helpers.fillField(this.searchInput, searchTerm);
    }
  }

  async getProjectCount(): Promise<number> {
    await this.page
      .waitForSelector(this.projectCards, { timeout: 5000 })
      .catch(() => {});
    return await this.page.locator(this.projectCards).count();
  }

  async getProjectNames(): Promise<string[]> {
    const projectCards = this.page.locator(this.projectCards);
    const count = await projectCards.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const name = await projectCards.nth(i).locator('h3').textContent();
      if (name) names.push(name.trim());
    }

    return names;
  }

  // Assertions
  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL('/home');
    await this.helpers.waitForAppReady();
  }

  async expectCreateProjectButtonToBeVisible() {
    await expect(this.page.locator(this.createProjectButton)).toBeVisible();
  }

  async expectProjectCardsToBeVisible() {
    await expect(this.page.locator(this.projectCards).first()).toBeVisible();
  }

  async expectEmptyStateToBeVisible() {
    await expect(this.page.locator(this.emptyState)).toBeVisible();
  }

  async expectProjectToExist(projectName: string) {
    const projectCard = this.page
      .locator(this.projectCards)
      .filter({ hasText: projectName });
    await expect(projectCard).toBeVisible();
  }

  async expectProjectCount(expectedCount: number) {
    await expect(this.page.locator(this.projectCards)).toHaveCount(
      expectedCount
    );
  }

  async expectLoadingSkeletonsToBeVisible() {
    await expect(
      this.page.locator(this.loadingSkeletons).first()
    ).toBeVisible();
  }

  async expectLoadingSkeletonsToBeHidden() {
    await expect(this.page.locator(this.loadingSkeletons)).toHaveCount(0);
  }

  async expectUserToBeLoggedIn() {
    // Check if we're on home page and can see page content
    await this.expectToBeOnHomePage();

    // Check for page content that indicates user is logged in
    const isLoggedIn = await this.helpers.isLoggedIn();
    expect(isLoggedIn).toBe(true);
  }

  async expectProjectCardToHaveStatus(projectName: string, status: string) {
    const projectCard = this.page
      .locator(this.projectCards)
      .filter({ hasText: projectName });
    await expect(projectCard).toContainText(status);
  }

  async expectProjectCardToHaveProgress(projectName: string, progress: string) {
    const projectCard = this.page
      .locator(this.projectCards)
      .filter({ hasText: projectName });
    await expect(projectCard).toContainText(progress);
  }
}
