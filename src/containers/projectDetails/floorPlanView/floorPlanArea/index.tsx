import { useMemo, useCallback, useState } from 'react';
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
import type { TaskWithDetails } from '@/database/dtos/task.dto';

interface FloorPlanAreaProps {
  className: string;
  tasks?: TaskWithDetails[];
}

const FloorPlanArea = ({ className, tasks }: FloorPlanAreaProps) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showRooms, setShowRooms] = useState(true);

  const selectedFloorPlan = useSelectedFloorPlan();
  const selectedRoom = useSelectedRoom();
  const setSelectedRoom = useSetSelectedRoom();

  const handleTaskSelect = useCallback(
    (task: TaskWithDetails) => {
      const currentParams = Object.fromEntries(searchParams.entries());
      setSearchParams({ ...currentParams, selectedTaskId: task.id });
    },
    [setSearchParams, searchParams]
  );

  const handleTaskCreate = useCallback(
    (lat: number, lng: number) => {
      const currentParams = Object.fromEntries(searchParams.entries());
      setSearchParams({
        ...currentParams,
        taskAction: EntityActions.ADD,
        taskLat: lat.toString(),
        taskLng: lng.toString(),
      });
    },
    [setSearchParams, searchParams]
  );

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

  const handleToggleRooms = () => {
    setShowRooms(!showRooms);
  };

  const isAddEditModalOpen =
    isModalVisible(EntityActions.ADD) || isModalVisible(EntityActions.EDIT);

  return (
    <>
      <div className={twMerge('bg-gray-50 p-4', className)}>
        <FloorPlanControls
          onAddRoom={handleAddRoom}
          showRooms={showRooms}
          onToggleRooms={handleToggleRooms}
        />

        {/* TODO: Not a big fan of so many props we can perhaps extract this into a custom functionality hook, refactor */}
        <FloorPlanContent
          floorPlan={selectedFloorPlan}
          rooms={rooms}
          tasks={tasks}
          selectedRoom={selectedRoom}
          showRooms={showRooms}
          isLoadingRooms={isLoadingRooms}
          isDeleteLoading={deleteRoom.isLoading}
          onRoomSelect={setSelectedRoom}
          onEditRoom={handleEditRoom}
          onDeleteRoom={handleDeleteRoom}
          onTaskSelect={handleTaskSelect}
          onTaskCreate={handleTaskCreate}
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
