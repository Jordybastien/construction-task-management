import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, Plus } from 'lucide-react';

interface FloorPlanControlsProps {
  onAddRoom: () => void;
}

const FloorPlanControls = ({ onAddRoom }: FloorPlanControlsProps) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          title={t('PAGES.PROJECT_DETAILS.FLOOR_PLAN.CONTROLS.ZOOM_IN')}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          title={t('PAGES.PROJECT_DETAILS.FLOOR_PLAN.CONTROLS.ZOOM_OUT')}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          title={t('PAGES.PROJECT_DETAILS.FLOOR_PLAN.CONTROLS.FIT')}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <Button
        size="sm"
        onClick={onAddRoom}
        className="flex items-center gap-1">
        <Plus className="h-3 w-3" />
        {t('PAGES.PROJECT_DETAILS.ROOM.ADD_ROOM')}
      </Button>
    </div>
  );
};

export default FloorPlanControls;