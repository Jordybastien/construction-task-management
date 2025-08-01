import { BaseDocType, ProjectRole } from '../schemas/base.schema';

export interface Project extends BaseDocType {
  name: string;
  description?: string;
  created_by: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  created_by: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

export interface ProjectUser {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  created_at: string;
}