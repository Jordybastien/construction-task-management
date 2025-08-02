import { RxJsonSchema, RxCollection, RxDocument } from 'rxdb';
import {
  BaseDocType,
  baseSchemaProperties,
  baseRequiredFields,
  TaskStatus,
} from './base.schema';

export interface TaskHistoryDocType extends BaseDocType {
  task_id: string;
  user_id: string;
  old_status: TaskStatus;
  new_status: TaskStatus;
  checklist_item_id?: string;
  checklist_item_name?: string;
}

export const taskHistorySchema: RxJsonSchema<TaskHistoryDocType> = {
  title: 'Task History Schema',
  description: 'History of task status changes',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    ...baseSchemaProperties,
    task_id: {
      type: 'string',
      maxLength: 36,
      ref: 'tasks',
    },
    user_id: {
      type: 'string',
      maxLength: 36,
      ref: 'users',
    },
    old_status: {
      type: 'string',
      enum: Object.values(TaskStatus),
    },
    new_status: {
      type: 'string',
      enum: Object.values(TaskStatus),
    },
    checklist_item_id: {
      type: 'string',
      maxLength: 36,
    },
    checklist_item_name: {
      type: 'string',
      maxLength: 255,
    },
  },
  required: [...baseRequiredFields, 'task_id', 'user_id', 'old_status', 'new_status'],
  indexes: ['task_id', ['task_id', 'created_at'], 'user_id', 'created_at'],
};

export type TaskHistoryDocument = RxDocument<TaskHistoryDocType>;
export type TaskHistoryCollection = RxCollection<TaskHistoryDocType>;