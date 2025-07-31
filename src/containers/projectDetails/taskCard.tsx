import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Task, TaskStatus } from '@/models/task';
import StatusIndicatorDot, { PillStatus } from '@/components/statusIndicator';
import { twMerge } from 'tailwind-merge';
import Typography from '@/components/typography';
import ProgressCircle from '@/components/progressCircle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
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
  isSelected = false,
}) => {
  const { t } = useTranslation();

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
              {t('PAGES.PROJECT_DETAILS.TASK.ROOM')} {task.room}
            </p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-xs text-gray-600">
              {task.completedItems} of {task.totalItems}{' '}
              {t('PAGES.PROJECT_DETAILS.TASK.ITEMS_DONE')}
            </p>
            <ProgressCircle progress={task.progress} size="md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
