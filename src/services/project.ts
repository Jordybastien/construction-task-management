import withApi from './apiHelper';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/database/dtos/project.dto';
import type { ProjectWithStats } from '@/database/schemas/project.schema';

export const fetchProjectsByUser = async (userId: string): Promise<ProjectWithStats[]> => {
  return await withApi(
    (api) => api.get(`/projects/user/${userId}`),
    async (db) => {
      return await db.projects.findProjectsByUserWithStats(userId);
    }
  );
};

export const createProject = async (payload: CreateProjectDto): Promise<Project> => {
  return await withApi(
    (api) => api.post('/projects', payload),
    async (db) => {
      const projectDoc = await db.projects.createProject(payload);
      return projectDoc.toJSON() as Project;
    }
  );
};

export const updateProject = async (projectId: string, payload: UpdateProjectDto): Promise<Project> => {
  return await withApi(
    (api) => api.put(`/projects/${projectId}`, payload),
    async (db) => {
      const projectDoc = await db.projects.updateProject(projectId, payload);
      return projectDoc?.toJSON() as Project;
    }
  );
};

export const deleteProject = async (projectId: string): Promise<void> => {
  return await withApi(
    (api) => api.delete(`/projects/${projectId}`),
    async (db) => {
      await db.projects.deleteProject(projectId);
    }
  );
};

export const fetchProjectById = async (projectId: string): Promise<Project> => {
  return await withApi(
    (api) => api.get(`/projects/${projectId}`),
    async (db) => {
      const projectDoc = await db.projects.findProjectById(projectId);
      return projectDoc?.toJSON() as Project;
    }
  );
};