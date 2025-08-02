import { useQuery } from '../useQuery';
import {
  useTasks as useTasksFromStore,
  useSetTasks,
} from '@/stores/task.store';
import { fetchTasksByFloorPlan } from '@/services/task';
import type { TaskWithDetails } from '@/database/dtos/task.dto';

interface UseTasksByFloorPlanResult {
  tasks: TaskWithDetails[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

const useTasksByFloorPlan = (
  floorPlanId: string | undefined
): UseTasksByFloorPlanResult => {
  const tasks = useTasksFromStore();
  const setTasks = useSetTasks();

  const queryResult = useQuery(
    async () => {
      if (!floorPlanId) {
        return [];
      }
      // Mimic backend server delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return fetchTasksByFloorPlan(floorPlanId);
    },
    {
      enabled: !!floorPlanId,
      onSuccess: (data) => {
        setTasks(data);
      },
    }
  );

  return {
    tasks,
    ...queryResult,
  };
};

export default useTasksByFloorPlan;
