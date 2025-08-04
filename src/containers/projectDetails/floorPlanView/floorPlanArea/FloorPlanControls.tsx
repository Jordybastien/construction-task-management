import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, Plus, Eye, EyeOff } from 'lucide-react';

interface FloorPlanControlsProps {
  onAddRoom: () => void;
  showRooms: boolean;
  onToggleRooms: () => void;
}

const FloorPlanControls = ({
  onAddRoom,
  showRooms,
  onToggleRooms,
}: FloorPlanControlsProps) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <Button
          variant="outline"
          onClick={onToggleRooms}
          className="flex items-center gap-1">
          {showRooms ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
          {showRooms
            ? t('PAGES.PROJECT_DETAILS.FLOOR_PLAN.CONTROLS.HIDE_ROOMS')
            : t('PAGES.PROJECT_DETAILS.FLOOR_PLAN.CONTROLS.SHOW_ROOMS')}
        </Button>
      </div>

      <Button size="sm" onClick={onAddRoom} className="flex items-center gap-1">
        <Plus className="h-3 w-3" />
        {t('PAGES.PROJECT_DETAILS.ROOM.ADD_ROOM')}
      </Button>
    </div>
  );
};

export default FloorPlanControls;
