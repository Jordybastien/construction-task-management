import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import TaskCard from '@/containers/projectDetails/taskCard';
import { Task } from '@/models/task';
import Typography from '@/components/typography';

interface TasksListProps {
  tasks: Task[];
  selectedTask: Task | null;
  onTaskSelect: (task: Task) => void;
}

const TasksList = ({ tasks, selectedTask, onTaskSelect }: TasksListProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-full flex-col lg:overflow-y-auto border-gray-200 bg-white">
      <div className="flex flex-col gap-y-4 border-b p-4">
        <div className="flex items-center justify-between">
          <Typography as="h4">
            {t('PAGES.PROJECT_DETAILS.FLOOR_PLAN.TASKS')} ({tasks.length})
          </Typography>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('PAGES.PROJECT_DETAILS.TASK.NEW')}
          </Button>
        </div>

        <div>
          <Input
            placeholder={t('PAGES.PROJECT_DETAILS.TASK.SEARCH_PLACEHOLDER')}
            className="h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 space-y-3 lg:overflow-y-auto px-4 pt-4 lg:pb-24">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isSelected={selectedTask?.id === task.id}
            onClick={() => onTaskSelect(task)}
          />
        ))}
      </div>
    </div>
  );
};

export default TasksList;
