import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TaskCard from '@/containers/projectDetails/taskCard';
import TaskDetailsSheet from '@/containers/projectDetails/TaskDetailsSheet';
import AddOrEditTaskModal from '@/containers/projectDetails/addOrEditTaskModal';
import DeleteTaskModal from '@/containers/projectDetails/task/deleteModal';
import useTasksByFloorPlan from '@/hooks/tasks/useFetchByFloorPlan';
import { useSelectedFloorPlan } from '@/stores/floorPlan.store';
import { TaskStatus } from '@/database/schemas/base.schema';
import { EntityActions } from '@/models/common';
import type { TaskWithDetails } from '@/database/dtos/task.dto';

const KanbanView: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedFloorPlan = useSelectedFloorPlan();

  const { tasks, isLoading } = useTasksByFloorPlan(selectedFloorPlan?.id);

  const selectedTaskId = useMemo(() => searchParams.get('selectedTaskId'), [searchParams]);
  const action = useMemo(() => searchParams.get('taskAction') as EntityActions | null, [searchParams]);
  const modalTaskId = useMemo(() => searchParams.get('taskId'), [searchParams]);

  const selectedTaskForModal = useMemo(
    () => modalTaskId ? tasks?.find((t) => t.id === modalTaskId) || null : null,
    [tasks, modalTaskId]
  );

  const addColumnStatus = useMemo(() => searchParams.get('addColumnStatus') as TaskStatus | null, [searchParams]);

  const tasksByStatus = useMemo(() => {
    return Object.values(TaskStatus).reduce((acc, status) => {
      acc[status] = tasks?.filter(task => task.status === status) || [];
      return acc;
    }, {} as Record<TaskStatus, TaskWithDetails[]>);
  }, [tasks]);

  const isModalVisible = useCallback(
    (entityAction: EntityActions) => {
      if (entityAction === EntityActions.ADD) {
        return action === EntityActions.ADD;
      }
      return entityAction === action && !!modalTaskId;
    },
    [action, modalTaskId]
  );

  const openModal = useCallback(
    (entityAction: EntityActions, taskId: string | null = null, columnStatus?: TaskStatus) => {
      const currentParams = Object.fromEntries(searchParams.entries());
      const params: Record<string, string> = { taskAction: entityAction };
      if (taskId) {
        params.taskId = taskId;
      }
      if (columnStatus && entityAction === EntityActions.ADD) {
        params.addColumnStatus = columnStatus;
      }
      setSearchParams({ ...currentParams, ...params });
    },
    [setSearchParams, searchParams]
  );

  const closeModal = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('taskAction');
    newParams.delete('taskId');
    newParams.delete('addColumnStatus');
    setSearchParams(newParams);
  }, [setSearchParams, searchParams]);

  const selectTask = useCallback((task: TaskWithDetails) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, selectedTaskId: task.id });
  }, [setSearchParams, searchParams]);

  const closeTaskDetails = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('selectedTaskId');
    newParams.delete('checklistAction');
    newParams.delete('checklistItemId');
    setSearchParams(newParams);
  }, [setSearchParams, searchParams]);

  const statusColumns = [
    {
      status: TaskStatus.NOT_STARTED,
      title: t('PAGES.PROJECT_DETAILS.KANBAN.NOT_STARTED'),
      tasks: tasksByStatus[TaskStatus.NOT_STARTED] || [],
    },
    {
      status: TaskStatus.IN_PROGRESS,
      title: t('PAGES.PROJECT_DETAILS.KANBAN.IN_PROGRESS'),
      tasks: tasksByStatus[TaskStatus.IN_PROGRESS] || [],
    },
    {
      status: TaskStatus.BLOCKED,
      title: t('PAGES.PROJECT_DETAILS.KANBAN.BLOCKED'),
      tasks: tasksByStatus[TaskStatus.BLOCKED] || [],
    },
    {
      status: TaskStatus.FINAL_CHECK,
      title: t('PAGES.PROJECT_DETAILS.KANBAN.FINAL_CHECK'),
      tasks: tasksByStatus[TaskStatus.FINAL_CHECK] || [],
    },
    {
      status: TaskStatus.DONE,
      title: t('PAGES.PROJECT_DETAILS.KANBAN.DONE'),
      tasks: tasksByStatus[TaskStatus.DONE] || [],
    },
  ];

  return (
    <>
      <div className="flex h-full flex-col bg-gray-50 p-4">
        <div className="flex flex-1 gap-4 overflow-x-auto">
          {statusColumns.map((column) => (
            <div
              key={column.status}
              className="flex w-80 min-w-80 flex-shrink-0 flex-col rounded-lg border border-gray-200">
              <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white">
                <h3 className="p-4 text-sm font-medium text-gray-900">
                  {column.title} ({column.tasks.length})
                </h3>
              </div>
              <div className="flex flex-1 flex-col overflow-hidden rounded-b-lg bg-gray-50">
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="h-24 animate-pulse rounded-lg bg-gray-200" />
                      ))}
                    </div>
                  ) : (
                    column.tasks.map((task) => (
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
                <div className="p-4 pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed"
                    onClick={() => openModal(EntityActions.ADD, null, column.status)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t('PAGES.PROJECT_DETAILS.KANBAN.ADD_TASK')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskDetailsSheet
        isVisible={!!selectedTaskId}
        onHide={closeTaskDetails}
      />

      <AddOrEditTaskModal
        isOpen={
          isModalVisible(EntityActions.ADD) ||
          isModalVisible(EntityActions.EDIT)
        }
        onClose={closeModal}
        task={selectedTaskForModal}
        addPresetStatus={addColumnStatus || undefined}
      />

      <DeleteTaskModal
        isOpen={isModalVisible(EntityActions.DELETE)}
        onClose={closeModal}
        task={selectedTaskForModal}
      />
    </>
  );
};

export default KanbanView;
