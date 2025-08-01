import { BaseDocType, ProjectRole, ProjectStatus } from '../schemas/base.schema';

export interface Project extends BaseDocType {
  name: string;
  description?: string;
  created_by: string;
  status: ProjectStatus;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  created_by: string;
  status?: ProjectStatus;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface ProjectUser {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  created_at: string;
}