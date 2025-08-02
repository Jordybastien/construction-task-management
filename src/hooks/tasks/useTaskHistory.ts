import { useCallback } from 'react';
import { useQuery } from '../useQuery';
import {
  useTaskHistoriesByTask,
  useSetTaskHistories,
} from '@/stores/taskHistory.store';
import { fetchTaskHistoryByTask } from '@/services/task';
import { QUERY_KEYS } from '@/utils/constants';
import type { TaskHistoryWithDetails } from '@/database/dtos/task.dto';

interface UseTaskHistoryResult {
  history: TaskHistoryWithDetails[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

const useTaskHistory = (
  taskId: string | undefined
): UseTaskHistoryResult => {
  const history = useTaskHistoriesByTask(taskId || '');
  const setTaskHistories = useSetTaskHistories();

  const onSuccess = useCallback((data: TaskHistoryWithDetails[]) => {
    if (taskId) {
      setTaskHistories(taskId, data);
    }
  }, [taskId, setTaskHistories]);

  const queryResult = useQuery(
    async () => {
      if (!taskId) {
        return [];
      }
      return fetchTaskHistoryByTask(taskId);
    },
    {
      enabled: !!taskId,
      queryKey: [QUERY_KEYS.TASK_HISTORY, taskId],
      onSuccess,
    }
  );

  return {
    history,
    ...queryResult,
  };
};

export default useTaskHistory;