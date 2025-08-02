import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EmptyIllustration from '@/components/emptyIllustration';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { RoomWithStats } from '@/database/dtos/room.dto';

interface RoomsListProps {
  rooms: RoomWithStats[];
  selectedRoom: RoomWithStats | null;
  isDeleteLoading: boolean;
  onRoomSelect: (room: RoomWithStats) => void;
  onEditRoom: (roomId: string) => void;
  onDeleteRoom: (room: RoomWithStats) => void;
}

const RoomsList = ({
  rooms,
  selectedRoom,
  isDeleteLoading,
  onRoomSelect,
  onEditRoom,
  onDeleteRoom,
}: RoomsListProps) => {
  const { t } = useTranslation();

  if (rooms.length === 0) {
    return (
      <div className="py-6 text-center">
        <EmptyIllustration
          message={t('PAGES.PROJECT_DETAILS.ROOM.NO_ROOMS')}
          size="sm"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {rooms.map((room) => (
        <div
          key={room.id}
          className={twMerge(
            'cursor-pointer rounded-lg border p-3 transition-colors hover:bg-gray-50',
            selectedRoom?.id === room.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200'
          )}
          onClick={() => onRoomSelect(room)}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h5 className="truncate text-sm font-medium text-gray-900">
                  {room.name}
                </h5>
                <p className="text-xs text-gray-500">
                  {t(
                    `ATTRIBUTES.ROOM.TYPE_ENUM.${room.room_type.toUpperCase()}`
                  )}
                  {room.area_sqm && ` • ${room.area_sqm}m²`}
                </p>
                <p className="text-xs text-gray-400">
                  {room.task_count} {t('PAGES.PROJECT_DETAILS.ROOM.TASKS')}
                  {room.completed_tasks > 0 && (
                    <span className="text-green-600">
                      {' '}
                      • {room.completed_tasks} {t('COMMON.COMPLETED')}
                    </span>
                  )}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditRoom(room.id);
                    }}
                    className="flex items-center gap-2">
                    <Edit2 className="h-3 w-3" />
                    {t('HELPERS.ACTIONS.EDIT')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRoom(room);
                    }}
                    disabled={isDeleteLoading}
                    className="flex items-center gap-2 text-red-600">
                    <Trash2 className="h-3 w-3" />
                    {t('HELPERS.ACTIONS.DELETE')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomsList;
