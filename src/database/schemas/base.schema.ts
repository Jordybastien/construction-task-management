export interface BaseDocType {
  id: string;
  created_at: string;
  updated_at: string;
}

export const baseSchemaProperties = {
  id: {
    type: 'string',
    maxLength: 36,
  },
  created_at: {
    type: 'string',
    format: 'date-time',
    maxLength: 30,
  },
  updated_at: {
    type: 'string',
    format: 'date-time',
    maxLength: 30,
  },
} as const;

export const baseRequiredFields = ['id', 'created_at', 'updated_at'] as const;

export const baseIndexes = ['created_at'] as const;

export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  FINAL_CHECK = 'final_check',
  DONE = 'done',
}

export enum ProjectRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export enum RoomType {
  KITCHEN = 'kitchen',
  BEDROOM = 'bedroom',
  BATHROOM = 'bathroom',
  LIVING_ROOM = 'living_room',
  OFFICE = 'office',
  HALLWAY = 'hallway',
  STORAGE = 'storage',
  UTILITY = 'utility',
  OTHER = 'other',
}