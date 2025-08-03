import { useQuery } from '../useQuery';
import {
  useFloorPlans as useFloorPlansFromStore,
  useSetFloorPlans,
  useSetSelectedFloorPlan,
} from '@/stores/floorPlan.store';
import { fetchFloorPlansByProject } from '@/services/floorPlan';
import type { FloorPlanWithStats } from '@/database/dtos/floorPlan.dto';

interface UseFloorPlansResult {
  floorPlans: FloorPlanWithStats[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

const useFloorPlansByProject = (projectId: string | undefined): UseFloorPlansResult => {
  const floorPlans = useFloorPlansFromStore();
  const setFloorPlans = useSetFloorPlans();
  const setSelectedFloorPlan = useSetSelectedFloorPlan();

  const queryResult = useQuery(
    async () => {
      if (!projectId) {
        return [];
      }
      return fetchFloorPlansByProject(projectId);
    },
    {
      enabled: !!projectId,
      onSuccess: (data) => {
        setFloorPlans(data);
        // Auto-select first floor plan if none selected and data exists
        if (data.length > 0) {
          setSelectedFloorPlan(data[0]);
        }
      },
    }
  );

  return {
    floorPlans: projectId ? floorPlans : [],
    ...queryResult,
  };
};

export default useFloorPlansByProject;