import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import TaskDetails from '@/containers/projectDetails/floorPlanView/taskDetails';

interface TaskDetailsSheetProps {
  isVisible: boolean;
  onHide: () => void;
}

const TaskDetailsSheet = ({ isVisible, onHide }: TaskDetailsSheetProps) => {
  const { t } = useTranslation();

  return (
    <Sheet open={isVisible} onOpenChange={(open) => !open && onHide()}>
      <SheetContent className="min-w-[400px] sm:min-w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {t('PAGES.PROJECT_DETAILS.TASK.DETAILS')}
          </SheetTitle>
          <SheetDescription>
            {t('PAGES.PROJECT_DETAILS.TASK.VIEW_DETAILS')}
          </SheetDescription>
        </SheetHeader>
        <TaskDetails />
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailsSheet;