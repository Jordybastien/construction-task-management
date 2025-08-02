import { ElementType, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import ViewToggle from '@/components/viewToggle';
import { Map, Kanban, ChevronRight } from 'lucide-react';
import FloorPlanView from './floorPlanView';
import KanbanView from './kanbanView';
import { useParams } from 'react-router';
import Typography from '@/components/typography';
import useProjectById from '@/hooks/projects/useFetchById';
import useFloorPlansByProject from '@/hooks/floorPlans/useFetchByProject';
import {
  useSelectedFloorPlan,
  useSetSelectedFloorPlan,
} from '@/stores/floorPlan.store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

  const { project } = useProjectById(projectId);
  const { floorPlans } = useFloorPlansByProject(projectId);
  const selectedFloorPlan = useSelectedFloorPlan();
  const setSelectedFloorPlan = useSetSelectedFloorPlan();

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
      <div className="sticky top-20 z-10 border-b border-gray-200 bg-white px-6 py-4">
        <div className="space-y-4">
          {/* Header with breadcrumb and controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Typography as="h4" className="flex items-center gap-2">
                {project?.name}
                {selectedFloorPlan && (
                  <>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    {floorPlans.length > 0 && (
                      <Select
                        value={selectedFloorPlan?.id || ''}
                        onValueChange={(value) => {
                          const floorPlan = floorPlans.find(
                            (fp) => fp.id === value
                          );
                          setSelectedFloorPlan(floorPlan || null);
                        }}>
                        <SelectTrigger
                          className="max-w-8 min-w-fit border-none shadow-none"
                          size="sm">
                          <SelectValue
                            placeholder={t(
                              'PAGES.PROJECT_DETAILS.SELECT_FLOOR_PLAN'
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {floorPlans.map((floorPlan) => (
                            <SelectItem key={floorPlan.id} value={floorPlan.id}>
                              {floorPlan.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </>
                )}
              </Typography>
            </div>

            <ViewToggle
              options={viewOptions}
              selected={currentView}
              onChange={handleViewChange}
            />
          </div>
        </div>
      </div>

      <div className="z-0 h-[calc(100vh-160px)]">
        <CurrentComponent />
      </div>
    </div>
  );
};

export default ProjectDetails;
