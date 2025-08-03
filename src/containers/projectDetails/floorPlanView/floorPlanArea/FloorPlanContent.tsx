import { useTranslation } from 'react-i18next';
import EmptyIllustration from '@/components/emptyIllustration';
import FloorPlanAreaSkeleton from './FloorPlanAreaSkeleton';
import FloorPlanImage from './FloorPlanImage';
import RoomsList from './RoomsList';
import type { RoomWithStats } from '@/database/dtos/room.dto';
import type { FloorPlanWithStats } from '@/database/dtos/floorPlan.dto';

interface FloorPlanContentProps {
  floorPlan: FloorPlanWithStats | null;
  rooms: RoomWithStats[];
  selectedRoom: RoomWithStats | null;
  isLoadingRooms: boolean;
  isDeleteLoading: boolean;
  onRoomSelect: (room: RoomWithStats) => void;
  onEditRoom: (roomId: string) => void;
  onDeleteRoom: (room: RoomWithStats) => void;
}

const FloorPlanContent = ({
  floorPlan,
  rooms,
  selectedRoom,
  isLoadingRooms,
  isDeleteLoading,
  onRoomSelect,
  onEditRoom,
  onDeleteRoom,
}: FloorPlanContentProps) => {
  const { t } = useTranslation();

  // No floor plan selected
  if (!floorPlan) {
    return (
      <div className="flex h-64 items-center justify-center">
        <EmptyIllustration
          message={t('PAGES.PROJECT_DETAILS.FLOOR_PLAN.SELECT_FLOOR_PLAN')}
        />
      </div>
    );
  }

  // Loading state
  if (isLoadingRooms) {
    return <FloorPlanAreaSkeleton />;
  }

  // Floor plan with content
  return (
    <div className="space-y-4">
      <FloorPlanImage floorPlan={floorPlan} />

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