import { Page, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class ProjectDetailsPage {
  private helpers: TestHelpers;

  constructor(public page: Page) {
    this.helpers = new TestHelpers(page);
  }

  // @Note: I know this is not a great way to do assertion, data-testid is appropriate
  // TODO: Use data-testid selectors
  get viewToggle() {
    return '.relative.flex.items-center.rounded-lg';
  }
  get floorPlanViewButton() {
    return 'button:has-text("Floor Plan")';
  }
  get kanbanViewButton() {
    return 'button:has-text("Kanban")';
  }
  get projectTitle() {
    return 'h1, h2, h3, h4, .project-title';
  }
  get floorPlanContainer() {
    return '.leaflet-container';
  }
  get kanbanBoard() {
    return '.flex.h-full.flex-col.bg-gray-50';
  }
  get taskCards() {
    return '.cursor-pointer.transition-colors';
  }
  get createTaskButton() {
    return 'button:has-text("Create Task"), [data-testid="create-task"]';
  }
  get floorPlanImage() {
    return '.floor-plan-map-container';
  }
  get taskMarkers() {
    return '.custom-task-marker';
  }
  get roomPolygons() {
    return '.custom-room-polygon';
  }
  get kanbanColumns() {
    return '.flex.w-80.min-w-80, .kanban-column';
  }
  get addTaskButton() {
    return 'button:has-text("Add Task")';
  }

  // Actions
  async goto(projectId: string) {
    await this.page.goto(`/project/${projectId}`);
    await this.helpers.waitForAppReady();
  }

  async switchToFloorPlanView() {
    const currentUrl = this.page.url();
    const projectId = currentUrl.split('/project/')[1];
    await this.page.goto(`/project/${projectId}?view=floor_plan`);
    await this.helpers.waitForAppReady();
  }

  async switchToKanbanView() {
    const currentUrl = this.page.url();
    const projectId = currentUrl.split('/project/')[1];
    await this.page.goto(`/project/${projectId}?view=kanban`);
    await this.helpers.waitForAppReady();
  }

  async clickOnFloorPlan(x: number, y: number) {
    const floorPlan = this.page.locator(this.floorPlanContainer).first();
    await floorPlan.click({ position: { x, y } });
  }

  async createTaskOnFloorPlan(x: number, y: number, taskTitle: string) {
    await this.clickOnFloorPlan(x, y);

    // Wait for task creation modal/form
    await this.page.waitForSelector('input[name="title"]', { timeout: 5000 });
    await this.page.fill('input[name="title"]', taskTitle);

    // Submit the form
    await this.page.click('button[type="submit"]');
    await this.helpers.waitForAppReady();
  }

  async clickTaskCard(taskTitle: string) {
    const taskCard = this.page
      .locator(this.taskCards)
      .filter({ hasText: taskTitle });
    await taskCard.click();
  }

  async dragTaskToColumn(taskTitle: string, targetColumn: string) {
    const task = this.page
      .locator(this.taskCards)
      .filter({ hasText: taskTitle });
    const column = this.page
      .locator(this.kanbanColumns)
      .filter({ hasText: targetColumn });

    await task.dragTo(column);
    await this.helpers.waitForAppReady();
  }

  async getTaskCount(): Promise<number> {
    await this.page
      .waitForSelector(this.taskCards, { timeout: 5000 })
      .catch(() => {});
    return await this.page.locator(this.taskCards).count();
  }

  async getTaskTitles(): Promise<string[]> {
    const taskCards = this.page.locator(this.taskCards);
    const count = await taskCards.count();
    const titles: string[] = [];

    for (let i = 0; i < count; i++) {
      const title = await taskCards
        .nth(i)
        .locator('h3, h4, .task-title')
        .textContent();
      if (title) titles.push(title.trim());
    }

    return titles;
  }

  async getKanbanColumnTasks(columnName: string): Promise<string[]> {
    const column = this.page
      .locator(this.kanbanColumns)
      .filter({ hasText: columnName });
    const tasks = column.locator(this.taskCards);
    const count = await tasks.count();
    const titles: string[] = [];

    for (let i = 0; i < count; i++) {
      const title = await tasks
        .nth(i)
        .locator('h3, h4, .task-title')
        .textContent();
      if (title) titles.push(title.trim());
    }

    return titles;
  }

  // Assertions
  async expectToBeOnProjectDetailsPage(projectId?: string, view?: string) {
    if (projectId) {
      await expect(this.page).toHaveURL(`/project/${projectId}?view=${view}`);
    } else {
      await expect(this.page).toHaveURL(/\/project\/[^\/]+/);
    }
    await this.helpers.waitForAppReady();
  }

  async expectViewToggleToBeVisible() {
    await expect(this.page.locator(this.viewToggle)).toBeVisible();
  }

  async expectFloorPlanViewToBeActive() {
    // Wait for floor plan container to be visible, or show empty state
    const hasFloorPlan = await this.helpers.isVisible(this.floorPlanContainer);
    const hasEmptyState = await this.helpers.isVisible(
      'div:has-text(\"Please select a floor plan to view\")'
    );
    const hasTasksList = await this.helpers.isVisible(
      'div:has-text(\"Tasks\")'
    );

    // Should have at least the tasks list (which is part of floor plan view)
    expect(hasFloorPlan || hasEmptyState || hasTasksList).toBe(true);

    // Check if we're in floor plan view by URL (or default without view param)
    const url = this.page.url();
    const isFloorPlanView =
      url.includes('view=floor_plan') || !url.includes('view=');
    expect(isFloorPlanView).toBe(true);
  }

  async expectKanbanViewToBeActive() {
    await expect(this.page.locator(this.kanbanBoard)).toBeVisible();
    // Check if we're in kanban view by URL
    await expect(this.page).toHaveURL(/view=kanban/);
  }

  async expectProjectTitle(title: string) {
    await expect(this.page.locator(this.projectTitle)).toContainText(title);
  }

  async expectTaskMarkersToBeVisible() {
    await expect(this.page.locator(this.taskMarkers).first()).toBeVisible();
  }

  async expectRoomPolygonsToBeVisible() {
    await expect(this.page.locator(this.roomPolygons).first()).toBeVisible();
  }

  async expectTaskToExist(taskTitle: string) {
    const taskCard = this.page
      .locator(this.taskCards)
      .filter({ hasText: taskTitle });
    await expect(taskCard).toBeVisible();
  }

  async expectTaskInColumn(taskTitle: string, columnName: string) {
    const column = this.page
      .locator(this.kanbanColumns)
      .filter({ hasText: columnName });
    const taskInColumn = column
      .locator(this.taskCards)
      .filter({ hasText: taskTitle });
    await expect(taskInColumn).toBeVisible();
  }

  async expectTaskCount(expectedCount: number) {
    await expect(this.page.locator(this.taskCards)).toHaveCount(expectedCount);
  }

  async expectKanbanColumnsToBeVisible() {
    const expectedColumns = [
      'Not Started',
      'In Progress',
      'Blocked',
      'Final Check',
      'Done',
    ];

    // Wait for kanban columns to be visible
    await expect(this.page.locator(this.kanbanColumns).first()).toBeVisible();

    // Check that we have the expected number of columns
    const columnCount = await this.page.locator(this.kanbanColumns).count();
    expect(columnCount).toBe(expectedColumns.length);
  }

  async expectFloorPlanToBeInteractive() {
    // Check if floor plan is loaded and interactive
    await expect(this.page.locator(this.floorPlanContainer)).toBeVisible();
    await expect(this.page.locator(this.floorPlanImage)).toBeVisible();

    // Check if we can interact with it (leaflet controls should be present)
    const hasControls =
      (await this.helpers.isVisible('.leaflet-control-zoom')) ||
      (await this.helpers.isVisible('.leaflet-control'));
    expect(hasControls).toBe(true);
  }
}
