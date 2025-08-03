import { useMutation } from '../useMutation';
import { useAddTask } from '@/stores/task.store';
import { createTask } from '@/services/task';
import type { CreateTaskDto, TaskWithDetails } from '@/database/dtos/task.dto';

interface UseCreateTaskResult {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  mutate: (variables: CreateTaskDto) => Promise<void>;
  reset: () => void;
}

const useCreateTask = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}): UseCreateTaskResult => {
  const addTask = useAddTask();

  return useMutation(
    async (payload: CreateTaskDto) => {
      return createTask(payload);
    },
    {
      onSuccess: (data) => {
        addTask(data as TaskWithDetails);
        options?.onSuccess?.();
      },
      onError: options?.onError,
    }
  );
};

export default useCreateTask;
