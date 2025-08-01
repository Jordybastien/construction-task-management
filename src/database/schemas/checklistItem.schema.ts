import { RxJsonSchema, RxCollection, RxDocument } from 'rxdb';
import {
  BaseDocType,
  baseSchemaProperties,
  baseRequiredFields,
  TaskStatus,
} from './base.schema';

export interface ChecklistItemDocType extends BaseDocType {
  task_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  order_index: number;
  completed_at?: string;
}

export const checklistItemSchema: RxJsonSchema<ChecklistItemDocType> = {
  title: 'Checklist Item Schema',
  description: 'Individual checklist items within tasks',
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
    title: {
      type: 'string',
      maxLength: 200,
    },
    description: {
      type: 'string',
      maxLength: 1000,
    },
    status: {
      type: 'string',
      enum: Object.values(TaskStatus),
      default: TaskStatus.NOT_STARTED,
      maxLength: 36,
    },
    order_index: {
      type: 'number',
      minimum: 0,
      maximum: 1000,
      default: 0,
      multipleOf: 1,
    },
    completed_at: {
      type: 'string',
      format: 'date-time',
      maxLength: 36,
    },
  },
  required: [
    ...baseRequiredFields,
    'task_id',
    'title',
    'status',
    'order_index',
  ],
  indexes: [
    'task_id',
    ['task_id', 'order_index'],
    ['task_id', 'status'],
    'status',
    'completed_at',
  ],
};

export type ChecklistItemDocument = RxDocument<ChecklistItemDocType>;
export type ChecklistItemCollection = RxCollection<ChecklistItemDocType>;
