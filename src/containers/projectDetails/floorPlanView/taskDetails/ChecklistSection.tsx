import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Typography from '@/components/typography';
import EmptyIllustration from '@/components/emptyIllustration';
import StatusIndicatorDot, { PillStatus } from '@/components/statusIndicator';
import { Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { TaskStatus } from '@/database/schemas/base.schema';
import type { ChecklistItem } from '@/database/dtos/task.dto';

const TASK_STATUS_TO_PILL_STATUS: Record<TaskStatus, PillStatus> = {
  [TaskStatus.NOT_STARTED]: 'unknown',
  [TaskStatus.IN_PROGRESS]: 'purple',
  [TaskStatus.BLOCKED]: 'danger',
  [TaskStatus.FINAL_CHECK]: 'warning',
  [TaskStatus.DONE]: 'success',
};

const STATUS_COLORS = {
  [TaskStatus.NOT_STARTED]: 'text-gray-600',
  [TaskStatus.IN_PROGRESS]: 'text-purple-600',
  [TaskStatus.BLOCKED]: 'text-red-600',
  [TaskStatus.FINAL_CHECK]: 'text-orange-600',
  [TaskStatus.DONE]: 'text-green-600 line-through',
};

interface ChecklistSectionProps {
  checklistItems?: ChecklistItem[];
  isLoading: boolean;
  isDeleteLoading: boolean;
  completedCount: number;
  onAddItem: () => void;
  onEditItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onStatusChange: (itemId: string, newStatus: TaskStatus) => void;
}

const ChecklistSection = ({
  checklistItems,
  isLoading,
  isDeleteLoading,
  completedCount,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onStatusChange,
}: ChecklistSectionProps) => {
  const { t } = useTranslation();

  const statusOptions = [
    {
      value: TaskStatus.NOT_STARTED,
      label: t('ATTRIBUTES.TASK.STATUS_ENUM.NOT_STARTED'),
    },
    {
      value: TaskStatus.IN_PROGRESS,
      label: t('ATTRIBUTES.TASK.STATUS_ENUM.IN_PROGRESS'),
    },
    {
      value: TaskStatus.BLOCKED,
      label: t('ATTRIBUTES.TASK.STATUS_ENUM.BLOCKED'),
    },
    {
      value: TaskStatus.FINAL_CHECK,
      label: t('ATTRIBUTES.TASK.STATUS_ENUM.FINAL_CHECK'),
    },
    { value: TaskStatus.DONE, label: t('ATTRIBUTES.TASK.STATUS_ENUM.DONE') },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <Typography as="span">
          {t('PAGES.PROJECT_DETAILS.KANBAN.CHECKLIST')} ({completedCount}{' '}
          {t('COMMON.OF')} {checklistItems?.length}
          &nbsp;
          {t('PAGES.PROJECT_DETAILS.TASK.CHECKLIST_COMPLETED')})
        </Typography>
        <Button
          size="sm"
          onClick={onAddItem}
          className="flex items-center gap-1">
          <Plus className="h-3 w-3" />
          {t('PAGES.PROJECT_DETAILS.CHECKLIST.ADD_ITEM')}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <div className="flex gap-1">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-6" />
              </div>
            </div>
          ))}
        </div>
      ) : checklistItems?.length === 0 ? (
        <div className="py-6 text-center">
          <EmptyIllustration
            message={t('PAGES.PROJECT_DETAILS.CHECKLIST.NO_ITEMS')}
            size="sm"
          />
        </div>
      ) : (
        <div className="space-y-2">
          {checklistItems?.map((item) => (
            <div key={item.id} className="group flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex min-h-6 min-w-6 items-center justify-center p-0">
                    <StatusIndicatorDot
                      status={TASK_STATUS_TO_PILL_STATUS[item.status]}
                    />
                    <ChevronDown className="ml-1 text-gray-400" size={8} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {statusOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onStatusChange(item.id, option.value)}
                      className="flex items-center gap-2">
                      <StatusIndicatorDot
                        status={TASK_STATUS_TO_PILL_STATUS[option.value]}
                      />
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <span className={`flex-1 text-sm ${STATUS_COLORS[item.status]}`}>
                {item.title}
              </span>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditItem(item.id)}
                  className="h-6 w-6 p-0">
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteItem(item.id)}
                  disabled={isDeleteLoading}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChecklistSection;
