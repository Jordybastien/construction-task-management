import { RxJsonSchema, RxCollection, RxDocument } from 'rxdb';
import {
  BaseDocType,
  baseSchemaProperties,
  baseRequiredFields,
  ProjectStatus,
} from './base.schema';

export interface ProjectDocType extends BaseDocType {
  name: string;
  description?: string;
  created_by: string;
  status: ProjectStatus;
}

export const projectSchema: RxJsonSchema<ProjectDocType> = {
  title: 'Project Schema',
  description: 'Construction projects',
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    ...baseSchemaProperties,
    name: {
      type: 'string',
      maxLength: 200,
    },
    description: {
      type: 'string',
      maxLength: 1000,
    },
    created_by: {
      type: 'string',
      maxLength: 36,
      ref: 'users',
    },
    status: {
      type: 'string',
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.PLANNING,
      maxLength: 36,
    },
  },
  required: [...baseRequiredFields, 'name', 'created_by', 'status'],
  indexes: ['created_by', 'name', 'created_at'],
};

export interface ProjectWithStats extends ProjectDocType {
  taskCount: number;
  progress: number;
}

export type ProjectDocument = RxDocument<ProjectDocType>;
export type ProjectCollection = RxCollection<ProjectDocType>;
