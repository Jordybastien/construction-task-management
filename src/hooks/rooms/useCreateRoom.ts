import { useMutation } from '../useMutation';
import { useAddRoom } from '@/stores/room.store';
import { createRoom } from '@/services/room';
import type { CreateRoomDto, RoomWithStats } from '@/database/dtos/room.dto';

interface UseCreateRoomResult {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  mutate: (variables: CreateRoomDto) => Promise<void>;
  reset: () => void;
}

const useCreateRoom = (options?: {
  onSuccess?: (data: RoomWithStats) => void;
  onError?: (error: any) => void;
}): UseCreateRoomResult => {
  const addRoom = useAddRoom();

  return useMutation(
    async (payload: CreateRoomDto) => {
      return createRoom(payload);
    },
    {
      onSuccess: (data) => {
        addRoom(data.floor_plan_id, data as RoomWithStats);
        options?.onSuccess?.(data as RoomWithStats);
      },
      onError: options?.onError,
    }
  );
};

export default useCreateRoom;