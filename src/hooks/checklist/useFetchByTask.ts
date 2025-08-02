import { useQuery } from '../useQuery';
import {
  useChecklistByTask,
  useSetChecklistItems,
} from '@/stores/checklist.store';
import { fetchChecklistItemsByTask } from '@/services/task';
import { QUERY_KEYS } from '@/utils/constants';
import type { ChecklistItem } from '@/database/dtos/task.dto';

interface UseFetchChecklistByTaskResult {
  checklistItems: ChecklistItem[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

const useFetchChecklistByTask = (
  taskId: string | undefined
): UseFetchChecklistByTaskResult => {
  const checklistItems = useChecklistByTask(taskId || '');
  const setChecklistItems = useSetChecklistItems();

  const queryResult = useQuery(
    async () => {
      if (!taskId) {
        return [];
      }
      return fetchChecklistItemsByTask(taskId);
    },
    {
      enabled: !!taskId,
      queryKey: [QUERY_KEYS.CHECKLIST_ITEMS_BY_TASK, taskId],
      onSuccess: (data) => {
        if (taskId) {
          setChecklistItems(taskId, data);
        }
      },
    }
  );

  return {
    checklistItems: taskId ? checklistItems : [],
    ...queryResult,
  };
};

export default useFetchChecklistByTask;
