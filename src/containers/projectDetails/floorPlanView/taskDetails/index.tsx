import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import Typography from '@/components/typography';
import EmptyIllustration from '@/components/emptyIllustration';
import useFetchChecklistByTask from '@/hooks/checklist/useFetchByTask';
import useUpdateChecklistItem from '@/hooks/checklist/useUpdateChecklistItem';
import useDeleteChecklistItem from '@/hooks/checklist/useDeleteChecklistItem';
import useTaskDetails from '@/hooks/tasks/useTaskDetails';
import useTaskHistory from '@/hooks/tasks/useTaskHistory';
import AddOrEditChecklistItemModal from '../../addOrEditChecklistItemModal';
import { toast } from 'sonner';
import { EntityActions } from '@/models/common';
import { TaskStatus } from '@/database/schemas/base.schema';
import TaskDetailsSkeleton from './TaskDetailsSkeleton';
import ChecklistSection from './ChecklistSection';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import TaskHistorySection from './TaskHistorySection';

const TaskDetails = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const taskId = searchParams.get('selectedTaskId');

  const { task: selectedTask, isLoading: isLoadingTask } = useTaskDetails(
    taskId || ''
  );

  const { checklistItems, isLoading: isLoadingChecklist } =
    useFetchChecklistByTask(taskId || '');

  const { history: taskHistory, isLoading: isLoadingHistory } = useTaskHistory(
    taskId || ''
  );

  const action = useMemo(
    () => searchParams.get('checklistAction') as EntityActions | null,
    [searchParams]
  );

  const checklistItemId = useMemo(
    () => searchParams.get('checklistItemId'),
    [searchParams]
  );

  const isModalVisible = useCallback(
    (entityAction: EntityActions) => {
      if (entityAction === EntityActions.ADD) {
        return action === EntityActions.ADD;
      }
      if (entityAction === EntityActions.DELETE) {
        return action === EntityActions.DELETE && !!checklistItemId;
      }
      return entityAction === action && !!checklistItemId;
    },
    [action, checklistItemId]
  );

  const selectedChecklistItem = useMemo(
    () =>
      checklistItemId
        ? checklistItems?.find((item) => item.id === checklistItemId) || null
        : null,
    [checklistItems, checklistItemId]
  );

  const openModal = useCallback(
    (entityAction: EntityActions, itemId: string | null = null) => {
      const params: Record<string, string> = { checklistAction: entityAction };
      if (itemId) {
        params.checklistItemId = itemId;
      }
      setSearchParams({ ...Object.fromEntries(searchParams), ...params });
    },
    [setSearchParams, searchParams]
  );

  const closeModal = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('checklistAction');
    newParams.delete('checklistItemId');
    setSearchParams(newParams);
  }, [setSearchParams, searchParams]);

  const { mutate: updateCheckList, isLoading: isUpdateLoading } =
    useUpdateChecklistItem({
      onSuccess: () => {
        toast.success(
          t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.SUCCESS.UPDATE_MESSAGE')
        );
      },
      onError: () => {
        toast.error(
          t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.ERROR.UPDATE_MESSAGE')
        );
      },
    });

  const { mutate: deleteChecklistItem, isLoading: isDeleteLoading } =
    useDeleteChecklistItem({
      onSuccess: () => {
        toast.success(
          t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.SUCCESS.DELETE_MESSAGE')
        );
      },
      onError: () => {
        toast.error(
          t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.ERROR.DELETE_MESSAGE')
        );
      },
    });

  const handleStatusChange = (itemId: string, newStatus: TaskStatus) => {
    if (!selectedTask) return;

    updateCheckList({
      checklistItemId: itemId,
      taskId: selectedTask.id,
      updates: { status: newStatus },
    });
  };

  const handleDeleteItem = (itemId: string) => {
    openModal(EntityActions.DELETE, itemId);
  };

  const confirmDelete = () => {
    if (!selectedTask || !checklistItemId) return;

    deleteChecklistItem({
      checklistItemId: checklistItemId,
      taskId: selectedTask.id,
    });

    closeModal();
  };

  const completedCount =
    checklistItems?.filter((item) => item.status === TaskStatus.DONE).length ||
    0;

  if (isLoadingTask) {
    return <TaskDetailsSkeleton />;
  }

  return (
    <>
      <div className="flex h-full flex-col border-gray-200 bg-white p-4 lg:overflow-y-auto">
        {selectedTask ? (
          <div className="space-y-4">
            <div>
              <Typography as="h4">{selectedTask.title}</Typography>
              <p className="text-sm text-gray-600">
                {selectedTask.room_name ||
                  t('PAGES.PROJECT_DETAILS.TASK.NO_ROOM_ASSIGNED')}{' '}
                •&nbsp;
                {t('PAGES.PROJECT_DETAILS.TASK.CREATED_BY')}&nbsp;
                {selectedTask.created_user_name}
              </p>
            </div>

            <div className="rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 p-3">
              <span className="text-sm font-medium text-orange-800">
                {t('PAGES.PROJECT_DETAILS.TASK.STATUS')}&nbsp;
                {t(
                  `ATTRIBUTES.TASK.STATUS_ENUM.${selectedTask.status.toUpperCase()}`
                )}
              </span>
            </div>

            <ChecklistSection
              checklistItems={checklistItems}
              isLoading={isLoadingChecklist}
              isDeleteLoading={isDeleteLoading}
              completedCount={completedCount}
              onAddItem={() => openModal(EntityActions.ADD)}
              onEditItem={(itemId) => openModal(EntityActions.EDIT, itemId)}
              onDeleteItem={handleDeleteItem}
              onStatusChange={handleStatusChange}
            />

            <TaskHistorySection
              history={taskHistory}
              isLoading={isLoadingHistory}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <EmptyIllustration
              message={t('PAGES.PROJECT_DETAILS.FLOOR_PLAN.CLICK_TASK_MARKER')}
              size="md"
            />
          </div>
        )}
      </div>

      <AddOrEditChecklistItemModal
        isOpen={
          isModalVisible(EntityActions.ADD) ||
          isModalVisible(EntityActions.EDIT)
        }
        onClose={closeModal}
        taskId={selectedTask?.id}
        checklistItem={selectedChecklistItem}
      />

      <DeleteConfirmationDialog
        isOpen={isModalVisible(EntityActions.DELETE)}
        isLoading={isDeleteLoading}
        checklistItem={selectedChecklistItem}
        onConfirm={confirmDelete}
        onCancel={closeModal}
      />
    </>
  );
};

export default TaskDetails;
