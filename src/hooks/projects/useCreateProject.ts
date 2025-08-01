import { useMutation } from '../useMutation';
import { useAddProject } from '@/stores/project.store';
import { createProject } from '@/services/project';
import type { ErrorProps } from '@/utils/errorHandler';
import type { CreateProjectDto, Project } from '@/database/dtos/project.dto';

interface UseCreateProjectOptions {
  onSuccess?: (project: Project) => void | Promise<void>;
  onError?: (error: ErrorProps) => void | Promise<void>;
}

export function useCreateProject({ onError, onSuccess }: UseCreateProjectOptions = {}) {
  const addProject = useAddProject();

  return useMutation(
    async (projectData: CreateProjectDto) => {
      const createdProject = await createProject(projectData);
      addProject(createdProject);
      return createdProject;
    },
    {
      onSuccess: (project) => {
        onSuccess?.(project);
      },
      onError: (error) => {
        onError?.(error);
      },
    }
  );
}