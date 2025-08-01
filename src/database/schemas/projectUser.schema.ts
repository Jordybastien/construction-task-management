import { RxJsonSchema, RxCollection, RxDocument } from 'rxdb';
import { ProjectRole } from './base.schema';

export interface ProjectUserDocType {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  created_at: string;
}

export const projectUserSchema: RxJsonSchema<ProjectUserDocType> = {
  title: 'Project User Schema',
  description: 'User roles and permissions within projects',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 36,
    },
    project_id: {
      type: 'string',
      maxLength: 36,
      ref: 'projects',
    },
    user_id: {
      type: 'string',
      maxLength: 36,
      ref: 'users',
    },
    role: {
      type: 'string',
      enum: Object.values(ProjectRole),
      default: ProjectRole.MEMBER,
      maxLength: 36,
    },
    created_at: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['id', 'project_id', 'user_id', 'role', 'created_at'],
  indexes: [
    'project_id',
    'user_id',
    ['project_id', 'user_id'],
    ['user_id', 'role'],
  ],
};

export type ProjectUserDocument = RxDocument<ProjectUserDocType>;
export type ProjectUserCollection = RxCollection<ProjectUserDocType>;
export { ProjectRole };
