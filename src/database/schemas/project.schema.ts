import { RxJsonSchema, RxCollection, RxDocument } from 'rxdb';
import {
  BaseDocType,
  baseSchemaProperties,
  baseRequiredFields,
} from './base.schema';

export interface ProjectDocType extends BaseDocType {
  name: string;
  description?: string;
  created_by: string;
}

export const projectSchema: RxJsonSchema<ProjectDocType> = {
  title: 'Project Schema',
  description: 'Construction projects with creator tracking',
  version: 0,
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
  },
  required: [...baseRequiredFields, 'name', 'created_by'],
  indexes: ['created_by', 'name', 'created_at'],
};

export type ProjectDocument = RxDocument<ProjectDocType>;
export type ProjectCollection = RxCollection<ProjectDocType>;
