import React, { useMemo, useState } from 'react';
import {
  BadgeCheck,
  Clock,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { format, parseISO, compareDesc } from 'date-fns';
import { TaskStatus } from '@/database/schemas/base.schema';
import type { TaskHistoryWithDetails } from '@/database/dtos/task.dto';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

const iconMap = {
  [TaskStatus.NOT_STARTED]: (
    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
  ),
  [TaskStatus.IN_PROGRESS]: (
    <Clock className="h-4 w-4 text-blue-500" size={14} />
  ),
  [TaskStatus.BLOCKED]: (
    <AlertCircle className="h-4 w-4 text-red-500" size={14} />
  ),
  [TaskStatus.FINAL_CHECK]: (
    <Eye className="h-4 w-4 text-orange-500" size={14} />
  ),
  [TaskStatus.DONE]: (
    <BadgeCheck className="h-4 w-4 text-green-500" size={14} />
  ),
};

const TaskHistoryLogs = ({
  history,
}: {
  history?: TaskHistoryWithDetails[];
}) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const sortedHistory = useMemo(() => {
    return [...(history || [])].sort((a, b) =>
      compareDesc(parseISO(a?.created_at || ''), parseISO(b?.created_at || ''))
    );
  }, [history]);

  const displayedHistory = useMemo(() => {
    return showAll ? sortedHistory : sortedHistory.slice(0, 5);
  }, [sortedHistory, showAll]);

  const hasMore = (sortedHistory?.length || 0) > 5;

  const handleViewMore = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="flex flex-col gap-y-6 border-gray-200">
      <div className="flex w-full items-center justify-between rounded-sm bg-gray-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600 uppercase">
            {t('PAGES.PROJECT_DETAILS.TASK.HISTORY')}
          </span>
        </div>
      </div>
      {displayedHistory?.map((item, index) => (
        <div key={item?.id} className="relative flex w-full flex-row gap-x-4">
          {index + 1 !== displayedHistory.length && (
            <span
              className="absolute top-6 left-5 z-10 -ml-px h-full w-0.5 bg-gray-100"
              aria-hidden="true"
            />
          )}
          <div className="z-20 flex max-h-10 min-h-10 max-w-10 min-w-10 items-center justify-center bg-white p-1.5">
            <div className="border-separator flex max-h-8 min-h-8 max-w-8 min-w-8 items-center justify-center rounded-full border bg-white p-2 shadow-xs">
              {iconMap[item?.new_status] || (
                <BadgeCheck className="h-4 w-4 text-gray-400" size={14} />
              )}
            </div>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-xs font-norma text-gray-500">
                {item?.checklist_item_name ? (
                  <>
                    <span className="font-semibold text-gray-800">
                      "{item.checklist_item_name}"
                    </span>{' '}
                    {t('PAGES.PROJECT_DETAILS.TASK.STATUS_CHANGED_FROM')}{' '}
                    {t(
                      `ATTRIBUTES.TASK.STATUS_ENUM.${item?.old_status?.toUpperCase()}`
                    )}{' '}
                    {t('COMMON.TO')}{' '}
                    {t(
                      `ATTRIBUTES.TASK.STATUS_ENUM.${item?.new_status?.toUpperCase()}`
                    )}
                  </>
                ) : (
                  <>
                    {t('PAGES.PROJECT_DETAILS.TASK.STATUS_CHANGED_FROM')}{' '}
                    {t(
                      `ATTRIBUTES.TASK.STATUS_ENUM.${item?.old_status?.toUpperCase()}`
                    )}{' '}
                    {t('COMMON.TO')}{' '}
                    {t(
                      `ATTRIBUTES.TASK.STATUS_ENUM.${item?.new_status?.toUpperCase()}`
                    )}
                  </>
                )}
              </h3>
              <p className="text-xs text-gray-500">
                {item?.user_name || t('COMMON.UNKNOWN_USER')}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-400">
                {format(parseISO(item?.created_at || ''), 'dd/MM/yyyy HH:mm')}
              </span>
            </div>
          </div>
        </div>
      ))}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewMore}
            className="text-sm text-gray-600 hover:text-gray-800">
            {showAll ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                {t('COMMON.VIEW_LESS')}
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                {t('COMMON.VIEW_MORE')} ({(sortedHistory?.length || 0) - 5})
              </>
            )}
          </Button>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export const TaskHistoryLogsSkeleton: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-6 border-gray-200">
      <div className="flex w-full items-center justify-between rounded-sm bg-gray-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600 uppercase">
            {t('PAGES.PROJECT_DETAILS.TASK.HISTORY')}
          </span>
          <Skeleton className="h-5 w-8" />
        </div>
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative flex w-full flex-row gap-x-4">
            {i !== 3 && (
              <span
                className="absolute top-6 left-5 z-10 -ml-px h-full w-0.5 bg-gray-100"
                aria-hidden="true"
              />
            )}
            <div className="z-20 flex max-h-10 min-h-10 max-w-10 min-w-10 items-center justify-center bg-white p-1.5">
              <Skeleton className="max-h-8 min-h-8 max-w-8 min-w-8 rounded-full" />
            </div>
            <div className="flex w-full flex-row items-center justify-between">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskHistoryLogs;
