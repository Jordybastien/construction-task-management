const APP_NAME = 'construction_management';

export const COOKIES_IDENTIFIERS = Object.freeze({
  APP_LOCALE: `${APP_NAME}:app_locale`,
  COOKIE_CONSENT: `${APP_NAME}:cookie_consent`,
});

export const LOCAL_STORAGE_IDENTIFIERS = Object.freeze({
  TOKEN_STORE_KEY: `${APP_NAME}:token`,
  USER_STORE_KEY: `${APP_NAME}:user`,
});

export const storeKeys = Object.freeze({
  AUTH_STORAGE: `${APP_NAME}:auth_storage`,
});

export const QUERY_KEYS = Object.freeze({
  // Projects
  PROJECTS: 'projects',
  PROJECT_BY_ID: 'project-by-id',
  
  // Floor Plans
  FLOOR_PLANS_BY_PROJECT: 'floor-plans-by-project',
  FLOOR_PLAN_BY_ID: 'floor-plan-by-id',
  
  // Rooms
  ROOMS_BY_FLOOR_PLAN: 'rooms-by-floor-plan',
  ROOM_BY_ID: 'room-by-id',
  
  // Tasks
  TASKS_BY_FLOOR_PLAN: 'tasks-by-floor-plan',
  TASKS_BY_ROOM: 'tasks-by-room',
  TASK_DETAILS: 'task-details',
  TASK_HISTORY: 'task-history',
  
  // Checklist Items
  CHECKLIST_ITEMS_BY_TASK: 'checklist-items-by-task',
  CHECKLIST_ITEM_BY_ID: 'checklist-item-by-id',
});
