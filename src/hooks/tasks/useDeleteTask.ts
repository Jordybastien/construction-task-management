import { useMutation } from '../useMutation';
import { useDeleteTask as useDeleteTaskStore } from '@/stores/task.store';
import { deleteTask } from '@/services/task';

interface UseDeleteTaskResult {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  mutate: (taskId: string) => Promise<void>;
  reset: () => void;
}

const useDeleteTask = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}): UseDeleteTaskResult => {
  const deleteTaskFromStore = useDeleteTaskStore();

  return useMutation(
    async (taskId: string) => {
      await deleteTask(taskId);
      deleteTaskFromStore(taskId);
    },
    {
      onSuccess: () => {
        options?.onSuccess?.();
      },
      onError: options?.onError,
    }
  );
};

export default useDeleteTask;
