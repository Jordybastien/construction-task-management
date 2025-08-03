import { useTranslation } from 'react-i18next';
import EmptyIllustration from '@/components/emptyIllustration';
import type { FloorPlanWithStats } from '@/database/dtos/floorPlan.dto';

interface FloorPlanImageProps {
  floorPlan: FloorPlanWithStats;
}

const FloorPlanImage = ({ floorPlan }: FloorPlanImageProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-[300px] items-center justify-center rounded-lg border-2 border-gray-200 bg-white">
      {floorPlan.image_url ? (
        <img
          src={floorPlan.image_url}
          alt={floorPlan.name}
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <EmptyIllustration
          message={t('PAGES.PROJECT_DETAILS.FLOOR_PLAN.NO_IMAGE')}
        />
      )}
    </div>
  );
};

export default FloorPlanImage;