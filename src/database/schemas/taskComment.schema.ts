import { RxJsonSchema, RxCollection, RxDocument } from 'rxdb';
import {
  BaseDocType,
  baseSchemaProperties,
  baseRequiredFields,
} from './base.schema';

export interface TaskCommentDocType extends BaseDocType {
  task_id: string;
  user_id: string;
  content: string;
}

export const taskCommentSchema: RxJsonSchema<TaskCommentDocType> = {
  title: 'Task Comment Schema',
  description: 'Comments on tasks',
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
    content: {
      type: 'string',
      maxLength: 2000,
      minLength: 1,
    },
  },
  required: [...baseRequiredFields, 'task_id', 'user_id', 'content'],
  indexes: ['task_id', ['task_id', 'created_at'], 'user_id', 'created_at'],
};

export type TaskCommentDocument = RxDocument<TaskCommentDocType>;
export type TaskCommentCollection = RxCollection<TaskCommentDocType>;
