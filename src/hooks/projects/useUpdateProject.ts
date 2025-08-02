import { useMutation } from '../useMutation';
import { useUpdateProject as useUpdateProjectStore } from '@/stores/project.store';
import { updateProject } from '@/services/project';
import type { ErrorProps } from '@/utils/errorHandler';
import type { UpdateProjectDto, Project } from '@/database/dtos/project.dto';

interface UseUpdateProjectOptions {
  onSuccess?: (project: Project) => void | Promise<void>;
  onError?: (error: ErrorProps) => void | Promise<void>;
}

export function useUpdateProject({ onError, onSuccess }: UseUpdateProjectOptions = {}) {
  const updateProjectInStore = useUpdateProjectStore();

  return useMutation(
    async ({ projectId, updates }: { projectId: string; updates: UpdateProjectDto }) => {
      const updatedProject = await updateProject(projectId, updates);
      updateProjectInStore(projectId, updatedProject);
      return updatedProject;
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