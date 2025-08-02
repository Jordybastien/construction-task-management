import TaskHistoryLogs, {
  TaskHistoryLogsSkeleton,
} from '@/containers/projectDetails/floorPlanView/taskDetails/taskHistoryLogs';
import type { TaskHistoryWithDetails } from '@/database/dtos/task.dto';

interface TaskHistorySectionProps {
  history?: TaskHistoryWithDetails[];
  isLoading: boolean;
}

const TaskHistorySection = ({
  history,
  isLoading,
}: TaskHistorySectionProps) => {
  return (
    <div className="mt-6">
      {isLoading ? (
        <TaskHistoryLogsSkeleton />
      ) : (
        <TaskHistoryLogs history={history} />
      )}
    </div>
  );
};

export default TaskHistorySection;
