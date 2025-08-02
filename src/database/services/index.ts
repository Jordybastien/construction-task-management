import type { Database } from '../index';
import { UserService } from './user.service';
import { ProjectService } from './project.service';
import { TaskService } from './task.service';
import { ChecklistService } from './checklist.service';
import { FloorPlanService } from './floorPlan.service';
import { RoomService } from './room.service';
import { TaskHistoryService } from './taskHistory.service';

export class DatabaseServices {
  public users: UserService;
  public projects: ProjectService;
  public tasks: TaskService;
  public checklist: ChecklistService;
  public floorPlans: FloorPlanService;
  public rooms: RoomService;
  public taskHistory: TaskHistoryService;

  constructor(database: Database) {
    this.users = new UserService(database);
    this.projects = new ProjectService(database);
    this.tasks = new TaskService(database);
    this.checklist = new ChecklistService(database);
    this.floorPlans = new FloorPlanService(database);
    this.rooms = new RoomService(database);
    this.taskHistory = new TaskHistoryService(database);
  }
}

export * from './user.service';
export * from './project.service';
export * from './task.service';
export * from './checklist.service';
export * from './floorPlan.service';
export * from './room.service';
export * from './taskHistory.service';
export * from './base.service';