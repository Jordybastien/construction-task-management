import { ElementType, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatch, useSearchParams } from 'react-router';
import ViewToggle from '@/components/viewToggle';
import { Map, Kanban } from 'lucide-react';
import FloorPlanView from './floorPlanView';
import KanbanView from './kanbanView';
import { useParams } from 'react-router';
import Typography from '@/components/typography';

enum ViewType {
  FLOOR_PLAN = 'floor_plan',
  KANBAN = 'kanban',
}

const COMPONENTS_MAPPING: Record<string, ElementType> = {
  [ViewType.FLOOR_PLAN]: FloorPlanView,
  [ViewType.KANBAN]: KanbanView,
};

const ProjectDetails = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: projectId } = useParams<{ id: string }>();

  const currentView = useMemo(
    () => searchParams.get('view') as ViewType,
    [searchParams]
  );

  const CurrentComponent = COMPONENTS_MAPPING[currentView] || FloorPlanView;

  const viewOptions = [
    {
      value: ViewType.FLOOR_PLAN,
      label: t('PAGES.PROJECT_DETAILS.VIEWS.FLOOR_PLAN'),
      icon: <Map className="h-4 w-4" />,
    },
    {
      value: ViewType.KANBAN,
      label: t('PAGES.PROJECT_DETAILS.VIEWS.KANBAN'),
      icon: <Kanban className="h-4 w-4" />,
    },
  ];

  const handleViewChange = (view: string) => {
    setSearchParams({ view });
  };

  return (
    <div className="h-full">
      <div className="sticky top-20 border-b border-gray-200 bg-white px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Typography as="h3">Floor plan Name</Typography>
            <Typography as="span">
              51 {t('PAGES.PROJECT_DETAILS.KANBAN.TOTAL_TASKS')}
            </Typography>
          </div>
          <ViewToggle
            options={viewOptions}
            selected={currentView}
            onChange={handleViewChange}
          />
        </div>
      </div>

      <div className="h-[calc(100vh-80px)] z-0">
        <CurrentComponent />
      </div>
    </div>
  );
};

export default ProjectDetails;
