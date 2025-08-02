import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import TaskCard from '@/containers/projectDetails/taskCard';
import Typography from '@/components/typography';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import EmptyIllustration from '@/components/emptyIllustration';
import AddOrEditTaskModal from '@/containers/projectDetails/addOrEditTaskModal';
import DeleteTaskModal from '@/containers/projectDetails/task/deleteModal';
import { useSearchParams } from 'react-router';
import { EntityActions } from '@/models/common';
import { isEmpty } from 'lodash';
import type { TaskWithDetails } from '@/database/dtos/task.dto';

interface TasksListProps {
  tasks: TaskWithDetails[];
  isLoading?: boolean;
}

const TasksList = ({
  tasks,
  isLoading,
}: TasksListProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const action = useMemo(
    () => searchParams.get('taskAction') as EntityActions | null,
    [searchParams]
  );

  const modalTaskId = useMemo(() => searchParams.get('taskId'), [searchParams]);
  const selectedTaskId = useMemo(() => searchParams.get('selectedTaskId'), [searchParams]);

  const isModalVisible = useCallback(
    (entityAction: EntityActions) => {
      if (entityAction === EntityActions.ADD) {
        return action === EntityActions.ADD;
      }
      return entityAction === action && !!modalTaskId;
    },
    [action, modalTaskId]
  );

  const selectedTaskForModal = useMemo(
    () => (modalTaskId ? tasks?.find((t) => t.id === modalTaskId) || null : null),
    [tasks, modalTaskId]
  );

  const openModal = useCallback(
    (entityAction: EntityActions, taskId: string | null = null) => {
      const currentParams = Object.fromEntries(searchParams.entries());
      const params: Record<string, string> = { taskAction: entityAction };
      if (taskId) {
        params.taskId = taskId;
      }
      setSearchParams({ ...currentParams, ...params });
    },
    [setSearchParams, searchParams]
  );

  const closeModal = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('taskAction');
    newParams.delete('taskId');
    setSearchParams(newParams);
  }, [setSearchParams, searchParams]);

  const selectTask = useCallback((task: TaskWithDetails) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, selectedTaskId: task.id });
  }, [setSearchParams, searchParams]);

  return (
    <div className="flex h-full flex-col border-gray-200 bg-white lg:overflow-y-auto">
      <div className="flex flex-col gap-y-4 border-b p-4">
        <div className="flex items-center justify-between">
          <Typography as="h4">
            {t('PAGES.PROJECT_DETAILS.FLOOR_PLAN.TASKS')} ({tasks.length})
          </Typography>
          {!isEmpty(tasks) && (
            <Button
              size="sm"
              className="flex items-center gap-2"
              onClick={() => openModal(EntityActions.ADD)}>
              <Plus className="h-4 w-4" />
              {t('PAGES.PROJECT_DETAILS.TASK.NEW')}
            </Button>
          )}
        </div>

        {!isEmpty(tasks) && (
          <div>
            <Input
              placeholder={t('PAGES.PROJECT_DETAILS.TASK.SEARCH_PLACEHOLDER')}
              className="h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3 px-4 pt-4 lg:overflow-y-auto lg:pb-24">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <TaskCardSkeleton key={`task-skeleton-${index}`} />
          ))
        ) : isEmpty(tasks) ? (
          <div className="flex w-full flex-col items-center justify-center gap-y-4 py-12">
            <EmptyIllustration
              message={t('PAGES.PROJECT_DETAILS.FLOOR_PLAN.NO_TASKS')}
            />
            <Button
              className="flex items-center gap-2"
              onClick={() => openModal(EntityActions.ADD)}>
              <Plus className="h-4 w-4" />
              {t('PAGES.PROJECT_DETAILS.TASK.NEW')}
            </Button>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isSelected={selectedTaskId === task.id}
              onClick={() => selectTask(task)}
              onEdit={(id) => openModal(EntityActions.EDIT, id)}
              onDelete={(id) => openModal(EntityActions.DELETE, id)}
            />
          ))
        )}
      </div>

      <AddOrEditTaskModal
        isOpen={
          isModalVisible(EntityActions.ADD) ||
          isModalVisible(EntityActions.EDIT)
        }
        onClose={closeModal}
        task={selectedTaskForModal}
      />

      <DeleteTaskModal
        isOpen={isModalVisible(EntityActions.DELETE)}
        onClose={closeModal}
        task={selectedTaskForModal}
      />
    </div>
  );
};

export default TasksList;

const TaskCardSkeleton: React.FC = () => {
  return (
    <Card className="cursor-pointer">
      <CardContent>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1">
            <div className="flex flex-row items-center gap-x-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
            </div>
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex flex-row items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
