import { useMutation } from '../useMutation';
import { useUpdateTask as useUpdateTaskStore } from '@/stores/task.store';
import { useCurrentUser } from '@/stores/auth.store';
import { updateTask } from '@/services/task';
import type { UpdateTaskDto, TaskWithDetails } from '@/database/dtos/task.dto';

interface UpdateTaskVariables {
  taskId: string;
  updates: UpdateTaskDto;
}

interface UseUpdateTaskResult {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  mutate: (variables: UpdateTaskVariables) => Promise<void>;
  reset: () => void;
}

const useUpdateTask = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}): UseUpdateTaskResult => {
  const updateTaskInStore = useUpdateTaskStore();
  const currentUser = useCurrentUser();

  return useMutation(
    async ({ taskId, updates }: UpdateTaskVariables) => {
      return updateTask(taskId, updates, currentUser?.id);
    },
    {
      onSuccess: (data) => {
        updateTaskInStore(data.id, data as TaskWithDetails);
        options?.onSuccess?.();
      },
      onError: options?.onError,
    }
  );
};

export default useUpdateTask;