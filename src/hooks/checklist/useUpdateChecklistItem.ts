import { useMutation } from '../useMutation';
import {
  useUpdateChecklistItem as useUpdateChecklistItemStore,
  getChecklistByTaskFromStore,
  calculateChecklistCounts,
} from '@/stores/checklist.store';
import { useUpdateTaskChecklistCounts } from '@/stores/task.store';
import { useCurrentUser } from '@/stores/auth.store';
import { useAddTaskHistory } from '@/stores/taskHistory.store';
import { updateChecklistItem } from '@/services/task';
import type {
  UpdateChecklistItemDto,
  ChecklistItem,
  TaskHistoryWithDetails,
} from '@/database/dtos/task.dto';

interface UpdateChecklistItemPayload {
  checklistItemId: string;
  taskId: string;
  updates: UpdateChecklistItemDto;
}

interface UseUpdateChecklistItemResult {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  mutate: (variables: UpdateChecklistItemPayload) => Promise<void>;
  reset: () => void;
}

const useUpdateChecklistItem = (options?: {
  onSuccess?: (data: ChecklistItem) => void;
  onError?: (error: any) => void;
}): UseUpdateChecklistItemResult => {
  const updateChecklistItemInStore = useUpdateChecklistItemStore();
  const updateTaskChecklistCounts = useUpdateTaskChecklistCounts();
  const currentUser = useCurrentUser();
  const addTaskHistory = useAddTaskHistory();

  return useMutation(
    async (payload: UpdateChecklistItemPayload) => {
      // Add task history immediately if status is changing
      if (payload.updates.status && currentUser) {
        const checklistItems = getChecklistByTaskFromStore(payload.taskId);
        const currentItem = checklistItems?.find(
          (item) => item.id === payload.checklistItemId
        );

        if (currentItem && currentItem.status !== payload.updates.status) {
          const optimisticHistory: TaskHistoryWithDetails = {
            id: `optimistic-${payload.checklistItemId}-${Date.now()}`,
            task_id: payload.taskId,
            user_id: currentUser.id,
            old_status: currentItem.status,
            new_status: payload.updates.status,
            checklist_item_id: payload.checklistItemId,
            checklist_item_name: currentItem.title,
            user_name: currentUser.name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          addTaskHistory(payload.taskId, optimisticHistory);
        }
      }

      return updateChecklistItem(
        payload.checklistItemId,
        payload.updates,
        currentUser?.id
      );
    },
    {
      onSuccess: (data) => {
        // Update checklist item in store
        updateChecklistItemInStore(data.task_id, data.id, data);

        // Get updated checklist items and calculate counts
        const checklistItems = getChecklistByTaskFromStore(data.task_id);
        const { completedCount, totalCount } =
          calculateChecklistCounts(checklistItems);

        // Update task store with new counts
        updateTaskChecklistCounts(data.task_id, completedCount, totalCount);

        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    }
  );
};

export default useUpdateChecklistItem;
