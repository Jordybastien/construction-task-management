import { useMutation } from '../useMutation';
import { 
  useDeleteChecklistItem as useDeleteChecklistItemStore,
  getChecklistByTaskFromStore,
  calculateChecklistCounts 
} from '@/stores/checklist.store';
import { useUpdateTaskChecklistCounts } from '@/stores/task.store';
import { deleteChecklistItem } from '@/services/task';

interface DeleteChecklistItemPayload {
  checklistItemId: string;
  taskId: string;
}

interface UseDeleteChecklistItemResult {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  mutate: (variables: DeleteChecklistItemPayload) => Promise<void>;
  reset: () => void;
}

const useDeleteChecklistItem = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}): UseDeleteChecklistItemResult => {
  const deleteChecklistItemFromStore = useDeleteChecklistItemStore();
  const updateTaskChecklistCounts = useUpdateTaskChecklistCounts();

  return useMutation(
    async (payload: DeleteChecklistItemPayload) => {
      await deleteChecklistItem(payload.checklistItemId);
      deleteChecklistItemFromStore(payload.taskId, payload.checklistItemId);
      
      // Get updated checklist items and calculate counts
      const checklistItems = getChecklistByTaskFromStore(payload.taskId);
      const { completedCount, totalCount } = calculateChecklistCounts(checklistItems);
      
      // Update task store with new counts
      updateTaskChecklistCounts(payload.taskId, completedCount, totalCount);
    },
    {
      onSuccess: () => {
        options?.onSuccess?.();
      },
      onError: options?.onError,
    }
  );
};

export default useDeleteChecklistItem;
