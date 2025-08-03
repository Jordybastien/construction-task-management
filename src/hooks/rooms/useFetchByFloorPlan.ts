import { useQuery } from '../useQuery';
import {
  useRoomsByFloorPlan,
  useSetRooms,
} from '@/stores/room.store';
import { fetchRoomsByFloorPlan } from '@/services/room';
import type { RoomWithStats } from '@/database/dtos/room.dto';

interface UseRoomsByFloorPlanResult {
  rooms: RoomWithStats[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

const useFetchRoomsByFloorPlan = (floorPlanId: string | undefined): UseRoomsByFloorPlanResult => {
  const rooms = useRoomsByFloorPlan(floorPlanId || '') || [];
  const setRooms = useSetRooms();

  const queryResult = useQuery(
    async () => {
      if (!floorPlanId) {
        return [];
      }
      return fetchRoomsByFloorPlan(floorPlanId);
    },
    {
      enabled: !!floorPlanId,
      onSuccess: (data) => {
        if (floorPlanId) {
          setRooms(floorPlanId, data);
        }
      },
    }
  );

  return {
    rooms: floorPlanId ? rooms : [],
    ...queryResult,
  };
};

export default useFetchRoomsByFloorPlan;