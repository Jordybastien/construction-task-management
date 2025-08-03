import { useMutation } from '../useMutation';
import { useUpdateRoom as useUpdateRoomStore } from '@/stores/room.store';
import { updateRoom } from '@/services/room';
import type { UpdateRoomDto, Room } from '@/database/dtos/room.dto';

interface UpdateRoomPayload {
  roomId: string;
  floorPlanId: string;
  updates: UpdateRoomDto;
}

interface UseUpdateRoomResult {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  mutate: (variables: UpdateRoomPayload) => Promise<void>;
  reset: () => void;
}

const useUpdateRoom = (options?: {
  onSuccess?: (data: Room) => void;
  onError?: (error: any) => void;
}): UseUpdateRoomResult => {
  const updateRoomInStore = useUpdateRoomStore();

  return useMutation(
    async (payload: UpdateRoomPayload) => {
      const response = await updateRoom(payload.roomId, payload.updates);
      updateRoomInStore(payload.floorPlanId, payload.roomId, response);
      return response;
    },
    {
      onSuccess: (data) => {
        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    }
  );
};

export default useUpdateRoom;
