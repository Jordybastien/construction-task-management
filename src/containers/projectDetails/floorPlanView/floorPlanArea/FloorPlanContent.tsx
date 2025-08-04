import { useTranslation } from 'react-i18next';
import EmptyIllustration from '@/components/emptyIllustration';
import FloorPlanAreaSkeleton from './FloorPlanAreaSkeleton';
import LeafletFloorPlan from './LeafletFloorPlan';
import RoomsList from './RoomsList';
import type { RoomWithStats } from '@/database/dtos/room.dto';
import type { FloorPlanWithStats } from '@/database/dtos/floorPlan.dto';
import type { TaskWithDetails } from '@/database/dtos/task.dto';

interface FloorPlanContentProps {
  floorPlan: FloorPlanWithStats | null;
  rooms: RoomWithStats[];
  tasks?: TaskWithDetails[];
  selectedRoom: RoomWithStats | null;
  showRooms?: boolean;
  isLoadingRooms: boolean;
  isDeleteLoading: boolean;
  onRoomSelect: (room: RoomWithStats) => void;
  onEditRoom: (roomId: string) => void;
  onDeleteRoom: (room: RoomWithStats) => void;
  onTaskSelect?: (task: TaskWithDetails) => void;
  onTaskCreate?: (lat: number, lng: number) => void;
}

const FloorPlanContent = ({
  floorPlan,
  rooms,
  tasks,
  selectedRoom,
  showRooms,
  isLoadingRooms,
  isDeleteLoading,
  onRoomSelect,
  onEditRoom,
  onDeleteRoom,
  onTaskSelect,
  onTaskCreate,
}: FloorPlanContentProps) => {
  const { t } = useTranslation();

  if (!floorPlan) {
    return (
      <div className="flex h-64 items-center justify-center">
        <EmptyIllustration
          message={t('PAGES.PROJECT_DETAILS.FLOOR_PLAN.SELECT_FLOOR_PLAN')}
        />
      </div>
    );
  }

  if (isLoadingRooms) {
    return <FloorPlanAreaSkeleton />;
  }

  return (
    <div className="space-y-4">
      <LeafletFloorPlan 
        floorPlan={floorPlan}
        tasks={tasks}
        rooms={rooms}
        showRooms={showRooms}
        onRoomSelect={onRoomSelect}
        onTaskSelect={onTaskSelect}
        onTaskCreate={onTaskCreate}
      />

      <div>
        <h4 className="mb-2 font-medium text-gray-900">
          {t('PAGES.PROJECT_DETAILS.ROOM.ROOMS_LIST')} ({rooms.length})
        </h4>

        <RoomsList
          rooms={rooms}
          selectedRoom={selectedRoom}
          isDeleteLoading={isDeleteLoading}
          onRoomSelect={onRoomSelect}
          onEditRoom={onEditRoom}
          onDeleteRoom={onDeleteRoom}
        />
      </div>
    </div>
  );
};

export default FloorPlanContent;
