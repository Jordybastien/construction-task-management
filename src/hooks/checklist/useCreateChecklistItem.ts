import { useMutation } from '../useMutation';
import { 
  useAddChecklistItem, 
  getChecklistByTaskFromStore,
  calculateChecklistCounts 
} from '@/stores/checklist.store';
import { useUpdateTaskChecklistCounts } from '@/stores/task.store';
import { createChecklistItem } from '@/services/task';
import type { CreateChecklistItemDto, ChecklistItem } from '@/database/dtos/task.dto';

interface UseCreateChecklistItemResult {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  mutate: (variables: CreateChecklistItemDto) => Promise<void>;
  reset: () => void;
}

const useCreateChecklistItem = (options?: {
  onSuccess?: (data: ChecklistItem) => void;
  onError?: (error: any) => void;
}): UseCreateChecklistItemResult => {
  const addChecklistItem = useAddChecklistItem();
  const updateTaskChecklistCounts = useUpdateTaskChecklistCounts();

  return useMutation(
    async (payload: CreateChecklistItemDto) => {
      return createChecklistItem(payload);
    },
    {
      onSuccess: (data) => {
        // Add checklist item to store
        addChecklistItem(data.task_id, data);
        
        // Get updated checklist items and calculate counts
        const checklistItems = getChecklistByTaskFromStore(data.task_id);
        const { completedCount, totalCount } = calculateChecklistCounts(checklistItems);
        
        // Update task store with new counts
        updateTaskChecklistCounts(data.task_id, completedCount, totalCount);
        
        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    }
  );
};

export default useCreateChecklistItem;