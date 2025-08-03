import '@babel/polyfill'; // Required polyfill for RxDB's ES8 features in older browsers
import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

import { setupReplication } from './sync/replication';
import {
  userSchema,
  type UserDocType,
  type UserCollection,
} from './schemas/user.schema';
import {
  projectSchema,
  type ProjectDocType,
  type ProjectCollection,
} from './schemas/project.schema';
import {
  projectUserSchema,
  type ProjectUserDocType,
  type ProjectUserCollection,
} from './schemas/projectUser.schema';
import {
  floorPlanSchema,
  type FloorPlanDocType,
  type FloorPlanCollection,
} from './schemas/floorPlan.schema';
import {
  roomSchema,
  type RoomDocType,
  type RoomCollection,
} from './schemas/room.schema';
import {
  taskSchema,
  type TaskDocType,
  type TaskCollection,
} from './schemas/task.schema';
import {
  checklistItemSchema,
  type ChecklistItemDocType,
  type ChecklistItemCollection,
} from './schemas/checklistItem.schema';
import {
  taskCommentSchema,
  type TaskCommentDocType,
  type TaskCommentCollection,
} from './schemas/taskComment.schema';
import {
  taskHistorySchema,
  type TaskHistoryDocType,
  type TaskHistoryCollection,
} from './schemas/taskHistory.schema';

if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin);
}

addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);
addRxPlugin(RxDBCleanupPlugin);
addRxPlugin(RxDBUpdatePlugin);

export type DatabaseCollections = {
  users: UserCollection;
  projects: ProjectCollection;
  project_users: ProjectUserCollection;
  floor_plans: FloorPlanCollection;
  rooms: RoomCollection;
  tasks: TaskCollection;
  checklist_items: ChecklistItemCollection;
  task_comments: TaskCommentCollection;
  task_history: TaskHistoryCollection;
};

export type Database = RxDatabase<DatabaseCollections>;

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const ONE_HOUR =
  MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const ONE_DAY = ONE_HOUR * HOURS_PER_DAY;
const SEVEN_DAYS = ONE_DAY * 7;
const THIRTY_DAYS = ONE_DAY * 30;

let dbInstance: Database | null = null;

/**
 * Creates or returns existing database instance for a specific user
 *
 * Each user gets their own database for complete data isolation.
 * This ensures that User A cannot access User B's data, even in the same browser.
 *
 * @param userId - Unique identifier for the user
 * @returns Promise<Database> - The RxDB database instance
 */
export async function createDatabase(userId: string): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const db = await createRxDatabase<DatabaseCollections>({
    name: `construction_task_manager_${userId}`,
    storage: wrappedValidateAjvStorage({
      storage: getRxStorageLocalstorage(),
    }),
    multiInstance: true, // Allow multiple tabs/windows to share the same database
    eventReduce: true, // Optimize query performance by reducing duplicate events
    closeDuplicates: true, // Close duplicate databases (useful for React hot reload) noticed in development
    cleanupPolicy: {
      minimumDeletedTime: SEVEN_DAYS, // Keep deleted docs for 7 days
      minimumCollectionAge: THIRTY_DAYS, // Collections must be 30 days old
      runEach: ONE_HOUR, // Run cleanup every hour
      awaitReplicationsInSync: true, // Wait for sync before cleanup
      waitForLeadership: true, // Only leader instance runs cleanup
    },
  });

  await db.addCollections({
    users: {
      schema: userSchema,
      localDocuments: true,
    },
    projects: {
      schema: projectSchema,
      migrationStrategies: {
        1: function (oldDoc: any) {
          // Add default status to existing projects
          oldDoc.status = 'planning';
          return oldDoc;
        }
      }
    },
    project_users: {
      schema: projectUserSchema,
    },
    floor_plans: {
      schema: floorPlanSchema,
    },
    rooms: {
      schema: roomSchema,
    },
    tasks: {
      schema: taskSchema,
    },
    checklist_items: {
      schema: checklistItemSchema,
    },
    task_comments: {
      schema: taskCommentSchema,
    },
    task_history: {
      schema: taskHistorySchema,
    },
  });

  // Replication disabled - no backend server
  // const replication = setupReplication(db);
  // replication?.start();

  dbInstance = db;
  return db;
}

/**
 * Properly closes the database connection and cleans up resources
 * Should be called when user logs out or application is shutting down
 * to prevent memory leaks and ensure data integrity.
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
}

export type {
  UserDocType,
  ProjectDocType,
  ProjectUserDocType,
  FloorPlanDocType,
  RoomDocType,
  TaskDocType,
  ChecklistItemDocType,
  TaskCommentDocType,
  TaskHistoryDocType,
};
