import { useMutation } from '../useMutation';
import { useAddProject } from '@/stores/project.store';
import { createProject } from '@/services/project';
import type { ErrorProps } from '@/utils/errorHandler';
import type { CreateProjectDto } from '@/database/dtos/project.dto';
import type { ProjectWithStats } from '@/database/schemas/project.schema';

interface UseCreateProjectOptions {
  onSuccess?: (project: ProjectWithStats) => void | Promise<void>;
  onError?: (error: ErrorProps) => void | Promise<void>;
}

export function useCreateProject({
  onError,
  onSuccess,
}: UseCreateProjectOptions = {}) {
  const addProject = useAddProject();

  return useMutation(
    async (projectData: CreateProjectDto) => {
      const createdProject = await createProject(projectData);
      // Mimic backend server delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 3000));
      addProject(createdProject as ProjectWithStats);
      return createdProject;
    },
    {
      onSuccess: (project) => {
        onSuccess?.(project as ProjectWithStats);
      },
      onError: (error) => {
        onError?.(error);
      },
    }
  );
}
