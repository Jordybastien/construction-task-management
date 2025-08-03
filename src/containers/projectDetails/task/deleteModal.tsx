import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import useDeleteTask from '@/hooks/tasks/useDeleteTask';
import { toast } from 'sonner';
import type { TaskWithDetails } from '@/database/dtos/task.dto';

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskWithDetails | null;
}

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const { t } = useTranslation();

  const { mutate: deleteTask, isLoading } = useDeleteTask({
    onSuccess: () => {
      onClose();
      toast.success(t('PAGES.PROJECT_DETAILS.TASK.FORM.SUCCESS.DELETE_MESSAGE') || 'Task deleted successfully!');
    },
    onError: (error) => {
      toast.error(error?.message || t('ERRORS.UNABLE_TO_PROCEED'));
    },
  });

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('PAGES.PROJECT_DETAILS.TASK.FORM.DELETE.TITLE') || 'Delete Task'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('PAGES.PROJECT_DETAILS.TASK.FORM.DELETE.DESCRIPTION', { 
              taskName: task?.title || '' 
            }) || `Are you sure you want to delete "${task?.title || ''}"? This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t('HELPERS.ACTIONS.CANCEL')}
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            loading={isLoading}
            variant="destructive"
          >
            {t('HELPERS.ACTIONS.DELETE')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTaskModal;