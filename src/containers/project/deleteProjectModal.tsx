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
import { useDeleteProject } from '@/hooks/projects/useDeleteProject';
import { toast } from 'sonner';
import type { ProjectWithStats } from '@/database/schemas/project.schema';

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectWithStats | null;
}

const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { t } = useTranslation();

  const { mutate: deleteProject, isLoading } = useDeleteProject({
    onSuccess: () => {
      onClose();
      toast.success(t('PAGES.PROJECT.FORM.SUCCESS.DELETE_MESSAGE'));
    },
    onError: (error) => {
      toast.error(error?.message || t('ERRORS.UNABLE_TO_PROCEED'));
    },
  });

  const handleDelete = () => {
    if (project) {
      deleteProject(project.id);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('PAGES.PROJECT.FORM.DELETE.TITLE')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('PAGES.PROJECT.FORM.DELETE.DESCRIPTION', { 
              projectName: project?.name || '' 
            })}
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

export default DeleteProjectModal;