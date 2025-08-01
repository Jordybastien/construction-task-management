import { useQuery } from '../useQuery';
import {
  useProjects as useProjectsFromStore,
  useSetProjects,
} from '@/stores/project.store';
import { fetchProjectsByUser } from '@/services/project';
import type { ProjectWithStats } from '@/database/schemas/project.schema';

interface UseProjectsResult {
  projects: ProjectWithStats[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

const useProjects = (userId: string | undefined): UseProjectsResult => {
  const projects = useProjectsFromStore();
  const setProjects = useSetProjects();

  if (!userId) {
    return {} as UseProjectsResult;
  }

  const queryResult = useQuery(
    async () => {
      // Mimic backend server delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      return fetchProjectsByUser(userId);
    },
    {
      enabled: !!userId,
      onSuccess: (data) => {
        setProjects(data);
      },
    }
  );

  return {
    projects,
    ...queryResult,
  };
};

export default useProjects;
