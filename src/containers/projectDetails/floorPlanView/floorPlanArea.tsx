import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import EmptyIllustration from '@/components/emptyIllustration';
import { twMerge } from 'tailwind-merge';

const FloorPlanArea = ({ className }: { className: string }) => {
  const { t } = useTranslation();

  return (
    <div className={twMerge('bg-gray-50 p-4', className)}>
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
      </div>

      <div className="flex items-center justify-center">
        <EmptyIllustration message="Floor plan shows up here." />
      </div>
    </div>
  );
};

export default FloorPlanArea;
