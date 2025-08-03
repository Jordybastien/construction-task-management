import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import StatusIndicatorDot, { PillStatus } from '@/components/statusIndicator';
import { twMerge } from 'tailwind-merge';
import Typography from '@/components/typography';
import ProgressCircle from '@/components/progressCircle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Edit, Trash } from 'lucide-react';
import type { TaskWithDetails } from '@/database/dtos/task.dto';
import { TaskStatus } from '@/database/schemas/base.schema';

interface TaskCardProps {
  task: TaskWithDetails;
  onClick?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isSelected?: boolean;
}

export const taskStatusVariants: Record<TaskStatus, PillStatus> = {
  [TaskStatus.NOT_STARTED]: 'unknown',
  [TaskStatus.IN_PROGRESS]: 'warning',
  [TaskStatus.BLOCKED]: 'danger',
  [TaskStatus.FINAL_CHECK]: 'purple',
  [TaskStatus.DONE]: 'success',
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  onEdit,
  onDelete,
  isSelected = false,
}) => {
  const { t } = useTranslation();

  const progress = task.checklist_count > 0 
    ? Math.round((task.completed_checklist_count / task.checklist_count) * 100)
    : 0;

  return (
    <Card
      className={twMerge(
        'cursor-pointer transition-colors hover:bg-gray-50',
        isSelected && 'ring-primary ring-2'
      )}
      onClick={onClick}>
      <CardContent>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-0">
            <div className="flex flex-row items-center gap-x-2">
              <Typography as="h4">{task.title}</Typography>
              <Tooltip>
                <TooltipTrigger>
                  <StatusIndicatorDot
                    status={taskStatusVariants[task.status]}
                    className="h-2.5 w-2.5"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t(`ATTRIBUTES.TASK.STATUS_ENUM.${task.status.toUpperCase()}`)}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-gray-600">
              {t('PAGES.PROJECT_DETAILS.TASK.ROOM')} {task.room_name || 'No room assigned'}
            </p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-xs text-gray-600">
              {task.completed_checklist_count} of {task.checklist_count}{' '}
              {t('PAGES.PROJECT_DETAILS.TASK.ITEMS_DONE')}
            </p>
            <div className="flex items-center gap-2">
              <ProgressCircle progress={progress} size="md" />
              {(onEdit || onDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="!px-0 focus:ring-0">
                    <EllipsisVertical className="text-gray-400" size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="text-xs">
                      {t('HELPERS.ACTIONS.ACTIONS')}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {onEdit && (
                      <DropdownMenuItem
                        className="flex flex-row gap-x-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(task.id);
                        }}
                      >
                        <Edit size={12} />
                        {t('HELPERS.ACTIONS.EDIT')}
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        className="flex flex-row gap-x-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(task.id);
                        }}
                      >
                        <Trash className="text-red-600" size={12} />
                        {t('HELPERS.ACTIONS.DELETE')}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
