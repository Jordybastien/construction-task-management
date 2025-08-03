import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { ChecklistItem } from '@/database/dtos/task.dto';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  checklistItem: ChecklistItem | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationDialog = ({
  isOpen,
  isLoading,
  checklistItem,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.DELETE.TITLE')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('PAGES.PROJECT_DETAILS.CHECKLIST.FORM.DELETE.DESCRIPTION', {
              itemTitle: checklistItem?.title || '',
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {t('COMMON.CANCEL')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700">
            {t('COMMON.DELETE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;