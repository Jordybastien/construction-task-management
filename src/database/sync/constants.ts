export const REPLICATION_IDENTIFIERS = Object.freeze({
  USERS: 'users-replication',
  PROJECTS: 'projects-replication',
  TASKS: 'tasks-replication',
  CHECKLIST_ITEMS: 'checklist-items-replication',
  TASK_COMMENTS: 'task-comments-replication',
});

export const REPLICATION_CONFIG = Object.freeze({
  retryTime: 5 * 1000,
  live: true,
  waitForLeadership: true,
});
