import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Task } from '@/models/task';
import Typography from '@/components/typography';
import EmptyIllustration from '@/components/emptyIllustration';

interface TaskDetailsProps {
  selectedTask: Task | null;
}

const TaskDetails = ({ selectedTask }: TaskDetailsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col lg:overflow-y-auto border-gray-200 bg-white p-4">
      <Typography as="h4">
        {t('PAGES.PROJECT_DETAILS.FLOOR_PLAN.TASK_DETAILS')}
      </Typography>

      {selectedTask ? (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">{selectedTask.title}</h3>
            <p className="text-sm text-gray-600">
              {selectedTask.room} • {t('PAGES.PROJECT_DETAILS.TASK.CREATED_BY')}{' '}
              {selectedTask.assignee}
            </p>
          </div>

          <div className="rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 p-3">
            <span className="text-sm font-medium text-orange-800">
              {t('PAGES.PROJECT_DETAILS.TASK.STATUS')}{' '}
              {selectedTask.status
                .replace('-', ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-900">
              {t('PAGES.PROJECT_DETAILS.KANBAN.CHECKLIST')} (
              {selectedTask.completedItems} of {selectedTask.totalItems}{' '}
              {t('PAGES.PROJECT_DETAILS.TASK.CHECKLIST_COMPLETED')})
            </h4>
            <div className="space-y-2">
              {selectedTask.checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full border ${
                      item.completed
                        ? 'border-green-600 bg-green-600'
                        : 'border-gray-300'
                    }`}>
                    {item.completed && (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              {t('PAGES.PROJECT_DETAILS.TASK.EDIT_TASK')}
            </Button>
            <Button variant="outline" className="flex-1">
              {t('PAGES.PROJECT_DETAILS.TASK.ADD_COMMENT')}
            </Button>
          </div>
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
  );
};

export default TaskDetails;
