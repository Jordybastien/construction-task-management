import type { Database } from '../index';
import { UserService } from './user.service';
import { ProjectService } from './project.service';
import { TaskService } from './task.service';
import { ChecklistService } from './checklist.service';

export class DatabaseServices {
  public users: UserService;
  public projects: ProjectService;
  public tasks: TaskService;
  public checklist: ChecklistService;

  constructor(database: Database) {
    this.users = new UserService(database);
    this.projects = new ProjectService(database);
    this.tasks = new TaskService(database);
    this.checklist = new ChecklistService(database);
  }
}

export * from './user.service';
export * from './project.service';
export * from './task.service';
export * from './checklist.service';
export * from './base.service';