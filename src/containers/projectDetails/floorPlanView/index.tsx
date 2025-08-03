import TasksList from './tasksList';
import FloorPlanArea from './floorPlanArea';
import TaskDetails from './taskDetails';
import useTasksByFloorPlan from '@/hooks/tasks/useFetchByFloorPlan';
import { useSelectedFloorPlan } from '@/stores/floorPlan.store';

const FloorPlanView = () => {
  const selectedFloorPlan = useSelectedFloorPlan();

  const { tasks, isLoading } = useTasksByFloorPlan(selectedFloorPlan?.id);

  return (
    <div className="grid h-full grid-cols-1 divide-x divide-gray-200 lg:grid-cols-[20rem_1fr_20rem] lg:overflow-y-hidden">
      <TasksList
        tasks={tasks}
        isLoading={isLoading}
      />
      <FloorPlanArea className="hidden lg:block lg:sticky lg:top-40" />
      <TaskDetails />
    </div>
  );
};

export default FloorPlanView;
