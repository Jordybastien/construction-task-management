import { useQuery } from '../useQuery';
import {
  useSelectedTask,
  useSetSelectedTask,
} from '@/stores/task.store';
import { fetchTaskById } from '@/services/task';
import { QUERY_KEYS } from '@/utils/constants';
import type { TaskWithDetails } from '@/database/dtos/task.dto';

interface UseTaskDetailsResult {
  task: TaskWithDetails | null;
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

const useTaskDetails = (taskId: string | undefined): UseTaskDetailsResult => {
  const selectedTask = useSelectedTask();
  const setSelectedTask = useSetSelectedTask();

  const queryResult = useQuery(
    async () => {
      if (!taskId) {
        return null;
      }
      return fetchTaskById(taskId);
    },
    {
      enabled: !!taskId,
      queryKey: [QUERY_KEYS.TASK_DETAILS, taskId],
      onSuccess: (data) => {
        if (data) {
          setSelectedTask(data as TaskWithDetails);
        }
      },
    }
  );

  return {
    task: taskId ? selectedTask : null,
    ...queryResult,
  };
};

export default useTaskDetails; 