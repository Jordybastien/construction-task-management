import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { useSelectedFloorPlan } from '@/stores/floorPlan.store';
import { useSelectedRoom, useSetSelectedRoom } from '@/stores/room.store';
import useFetchRoomsByFloorPlan from '@/hooks/rooms/useFetchByFloorPlan';
import useDeleteRoom from '@/hooks/rooms/useDeleteRoom';
import AddOrEditRoomModal from '../../task/addOrEditModal';
import { toast } from 'sonner';
import { EntityActions } from '@/models/common';
import { useTranslation } from 'react-i18next';
import FloorPlanControls from './FloorPlanControls';
import FloorPlanContent from './FloorPlanContent';

interface FloorPlanAreaProps {
  className: string;
}

const FloorPlanArea = ({ className }: FloorPlanAreaProps) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedFloorPlan = useSelectedFloorPlan();
  const selectedRoom = useSelectedRoom();
  const setSelectedRoom = useSetSelectedRoom();

  const { rooms, isLoading: isLoadingRooms } = useFetchRoomsByFloorPlan(
    selectedFloorPlan?.id
  );

  const action = useMemo(
    () => searchParams.get('roomAction') as EntityActions | null,
    [searchParams]
  );

  const roomId = useMemo(() => searchParams.get('roomId'), [searchParams]);

  const isModalVisible = useCallback(
    (entityAction: EntityActions) => {
      if (entityAction === EntityActions.ADD) {
        return action === EntityActions.ADD;
      }
      return entityAction === action && !!roomId;
    },
    [action, roomId]
  );

  const selectedRoomForEdit = useMemo(
    () => (roomId ? rooms?.find((room) => room.id === roomId) || null : null),
    [rooms, roomId]
  );

  const openModal = useCallback(
    (entityAction: EntityActions, roomIdParam: string | null = null) => {
      const params: Record<string, string> = { roomAction: entityAction };
      if (roomIdParam) {
        params.roomId = roomIdParam;
      }
      setSearchParams({ ...Object.fromEntries(searchParams), ...params });
    },
    [setSearchParams, searchParams]
  );

  const closeModal = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('roomAction');
    newParams.delete('roomId');
    setSearchParams(newParams);
  }, [setSearchParams, searchParams]);

  const deleteRoom = useDeleteRoom({
    onSuccess: () => {
      toast.success(
        t('PAGES.PROJECT_DETAILS.ROOM.FORM.SUCCESS.DELETE_MESSAGE')
      );
      if (selectedRoom && rooms.find((r) => r.id === selectedRoom.id)) {
        setSelectedRoom(null);
      }
    },
    onError: () => {
      toast.error(t('PAGES.PROJECT_DETAILS.ROOM.FORM.ERROR.DELETE_MESSAGE'));
    },
  });

  const handleDeleteRoom = (roomToDelete: (typeof rooms)[0]) => {
    if (!selectedFloorPlan) return;

    deleteRoom.mutate({
      roomId: roomToDelete.id,
      floorPlanId: selectedFloorPlan.id,
    });
  };

  const handleEditRoom = (roomId: string) => {
    openModal(EntityActions.EDIT, roomId);
  };

  const handleAddRoom = () => {
    openModal(EntityActions.ADD);
  };

  const isAddEditModalOpen = 
    isModalVisible(EntityActions.ADD) || isModalVisible(EntityActions.EDIT);

  return (
    <>
      <div className={twMerge('bg-gray-50 p-4', className)}>
        <FloorPlanControls onAddRoom={handleAddRoom} />
        
        <FloorPlanContent
          floorPlan={selectedFloorPlan}
          rooms={rooms}
          selectedRoom={selectedRoom}
          isLoadingRooms={isLoadingRooms}
          isDeleteLoading={deleteRoom.isLoading}
          onRoomSelect={setSelectedRoom}
          onEditRoom={handleEditRoom}
          onDeleteRoom={handleDeleteRoom}
        />
      </div>

      <AddOrEditRoomModal
        isOpen={isAddEditModalOpen}
        onClose={closeModal}
        floorPlanId={selectedFloorPlan?.id}
        room={selectedRoomForEdit}
      />
    </>
  );
};

export default FloorPlanArea;