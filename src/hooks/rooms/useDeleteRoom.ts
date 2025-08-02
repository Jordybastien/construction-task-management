import { useMutation } from '../useMutation';
import { useDeleteRoom as useDeleteRoomStore } from '@/stores/room.store';
import { deleteRoom } from '@/services/room';

interface DeleteRoomPayload {
  roomId: string;
  floorPlanId: string;
}

interface UseDeleteRoomResult {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  mutate: (variables: DeleteRoomPayload) => Promise<void>;
  reset: () => void;
}

const useDeleteRoom = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}): UseDeleteRoomResult => {
  const deleteRoomFromStore = useDeleteRoomStore();

  return useMutation(
    async (payload: DeleteRoomPayload) => {
      await deleteRoom(payload.roomId);
      deleteRoomFromStore(payload.floorPlanId, payload.roomId);
    },
    {
      onSuccess: () => {
        options?.onSuccess?.();
      },
      onError: options?.onError,
    }
  );
};

export default useDeleteRoom;
