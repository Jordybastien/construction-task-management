import { useMutation } from '../useMutation';
import { useDeleteProject as useDeleteProjectStore } from '@/stores/project.store';
import { deleteProject } from '@/services/project';
import type { ErrorProps } from '@/utils/errorHandler';

interface UseDeleteProjectOptions {
  onSuccess?: () => void | Promise<void>;
  onError?: (error: ErrorProps) => void | Promise<void>;
}

export function useDeleteProject({ onError, onSuccess }: UseDeleteProjectOptions = {}) {
  const deleteProjectFromStore = useDeleteProjectStore();

  return useMutation(
    async (projectId: string) => {
      await deleteProject(projectId);
      deleteProjectFromStore(projectId);
      return projectId;
    },
    {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (error) => {
        onError?.(error);
      },
    }
  );
}