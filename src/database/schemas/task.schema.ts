import { RxJsonSchema, RxCollection, RxDocument } from 'rxdb';
import {
  BaseDocType,
  baseSchemaProperties,
  baseRequiredFields,
  TaskStatus,
} from './base.schema';

export interface TaskDocType extends BaseDocType {
  title: string;
  description?: string;
  room_id?: string;
  position_lat: number;
  position_lng: number;
  status: TaskStatus;
  created_by: string;
  assigned_to?: string;
  completed_at?: string;
}

export const taskSchema: RxJsonSchema<TaskDocType> = {
  title: 'Task Schema',
  description:
    'Construction tasks with spatial positioning and status tracking',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    ...baseSchemaProperties,
    title: {
      type: 'string',
      maxLength: 200,
    },
    description: {
      type: 'string',
      maxLength: 2000,
    },
    room_id: {
      type: 'string',
      maxLength: 36,
      ref: 'rooms',
    },
    position_lat: {
      type: 'number',
      minimum: -180,
      maximum: 180,
    },
    position_lng: {
      type: 'number',
      minimum: -180,
      maximum: 180,
    },
    status: {
      type: 'string',
      enum: Object.values(TaskStatus),
      default: TaskStatus.NOT_STARTED,
      maxLength: 36,
    },
    created_by: {
      type: 'string',
      maxLength: 36,
      ref: 'users',
    },
    assigned_to: {
      type: 'string',
      maxLength: 36,
      ref: 'users',
    },
    completed_at: {
      type: 'string',
      format: 'date-time',
      maxLength: 30,
    },
  },
  required: [
    ...baseRequiredFields,
    'title',
    'position_lat',
    'position_lng',
    'status',
    'created_by',
  ],
  indexes: [
    'status',
    'created_by',
    'assigned_to',
    'room_id',
    ['status', 'assigned_to'],
    ['room_id', 'status'],
    'created_at',
    'completed_at',
  ],
};

export type TaskDocument = RxDocument<TaskDocType>;
export type TaskCollection = RxCollection<TaskDocType>;
export { TaskStatus };
