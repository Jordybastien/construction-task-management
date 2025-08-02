import { useQuery } from '../useQuery';
import {
  useSelectedProject,
  useSetSelectedProject,
} from '@/stores/project.store';
import { fetchProjectById } from '@/services/project';
import type { ProjectWithStats } from '@/database/schemas/project.schema';

interface UseProjectByIdResult {
  project: ProjectWithStats | null;
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

const useProjectById = (projectId: string | undefined): UseProjectByIdResult => {
  const selectedProject = useSelectedProject();
  const setSelectedProject = useSetSelectedProject();

  const queryResult = useQuery(
    async () => {
      if (!projectId) {
        return null;
      }
      return fetchProjectById(projectId);
    },
    {
      enabled: !!projectId,
      onSuccess: (data) => {
        if (data) {
          setSelectedProject(data as ProjectWithStats);
        }
      },
    }
  );

  return {
    project: projectId ? selectedProject : null,
    ...queryResult,
  };
};

export default useProjectById;