import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TaskCard from '@/containers/projectDetails/taskCard';
import { Task, TaskStatus, TaskPriority } from '@/models/task';

interface KanbanViewProps {
  projectId?: string;
}

const KanbanView: React.FC<KanbanViewProps> = () => {
  const { t } = useTranslation();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tasks: Task[] = [
    {
      id: 1,
      title: 'Install Bathroom Fixtures',
      room: 'Bathroom 1',
      progress: 20,
      completedItems: 3,
      totalItems: 5,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assignee: 'Mike',
      lastUpdated: '2d ago',
      checklist: [
        { id: 1, text: 'Remove old fixtures', status: TaskStatus.DONE, completed: true },
        { id: 2, text: 'Install plumbing', status: TaskStatus.DONE, completed: true },
        { id: 3, text: 'Mount toilet', status: TaskStatus.IN_PROGRESS, completed: false },
        { id: 4, text: 'Install sink', status: TaskStatus.NOT_STARTED, completed: false },
        { id: 5, text: 'Final inspection', status: TaskStatus.NOT_STARTED, completed: false },
      ],
    },
    {
      id: 2,
      title: 'Electrical Wiring',
      room: 'Bathroom 2',
      progress: 40,
      completedItems: 2,
      totalItems: 5,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      assignee: 'Sarah',
      lastUpdated: '2d ago',
      checklist: [
        { id: 1, text: 'Install outlets', status: TaskStatus.DONE, completed: true },
        { id: 2, text: 'Wire switches', status: TaskStatus.DONE, completed: true },
        { id: 3, text: 'Test circuits', status: TaskStatus.BLOCKED, completed: false },
        { id: 4, text: 'Install fixtures', status: TaskStatus.NOT_STARTED, completed: false },
        { id: 5, text: 'Final inspection', status: TaskStatus.NOT_STARTED, completed: false },
      ],
    },
    {
      id: 3,
      title: 'Floor Installation',
      room: 'Bathroom 3',
      progress: 60,
      completedItems: 3,
      totalItems: 5,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.LOW,
      assignee: 'John',
      lastUpdated: '1d ago',
      checklist: [
        { id: 1, text: 'Remove old flooring', status: TaskStatus.DONE, completed: true },
        { id: 2, text: 'Install underlayment', status: TaskStatus.DONE, completed: true },
        { id: 3, text: 'Lay tiles', status: TaskStatus.DONE, completed: true },
        { id: 4, text: 'Grout tiles', status: TaskStatus.IN_PROGRESS, completed: false },
        { id: 5, text: 'Seal grout', status: TaskStatus.NOT_STARTED, completed: false },
      ],
    },
    {
      id: 4,
      title: 'Paint Walls',
      room: 'Bathroom 4',
      progress: 80,
      completedItems: 4,
      totalItems: 5,
      status: TaskStatus.FINAL_CHECK,
      priority: TaskPriority.MEDIUM,
      assignee: 'Mike',
      lastUpdated: '3d ago',
      checklist: [
        { id: 1, text: 'Prepare surfaces', status: TaskStatus.DONE, completed: true },
        { id: 2, text: 'Apply primer', status: TaskStatus.DONE, completed: true },
        { id: 3, text: 'Paint first coat', status: TaskStatus.DONE, completed: true },
        { id: 4, text: 'Paint second coat', status: TaskStatus.DONE, completed: true },
        { id: 5, text: 'Touch up', status: TaskStatus.FINAL_CHECK, completed: false },
      ],
    },
    {
      id: 5,
      title: 'Install Cabinets',
      room: 'Bathroom 5',
      progress: 100,
      completedItems: 5,
      totalItems: 5,
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      assignee: 'Sarah',
      lastUpdated: '1d ago',
      checklist: [
        { id: 1, text: 'Measure space', status: TaskStatus.DONE, completed: true },
        { id: 2, text: 'Install brackets', status: TaskStatus.DONE, completed: true },
        { id: 3, text: 'Mount cabinets', status: TaskStatus.DONE, completed: true },
        { id: 4, text: 'Install hardware', status: TaskStatus.DONE, completed: true },
        { id: 5, text: 'Final inspection', status: TaskStatus.DONE, completed: true },
      ],
    },
  ];

  return (
    <div className="h-full bg-gray-50 p-4">
      <div className="mb-6 flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">
          {t('PAGES.PROJECT_DETAILS.KANBAN.FILTERS')}
        </span>
        <Button variant="outline" size="sm">
          {t('PAGES.PROJECT_DETAILS.KANBAN.ALL_ROOMS')}
        </Button>
        <Button variant="outline" size="sm">
          {t('PAGES.PROJECT_DETAILS.KANBAN.ALL_USERS')}
        </Button>
        <Button variant="outline" size="sm">
          {t('PAGES.PROJECT_DETAILS.KANBAN.PRIORITY')}
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto">
        {[
          {
            title: t('PAGES.PROJECT_DETAILS.KANBAN.NOT_STARTED'),
            count: 8,
            status: 'not-started',
          },
          {
            title: t('PAGES.PROJECT_DETAILS.KANBAN.IN_PROGRESS'),
            count: 12,
            status: 'in-progress',
          },
          {
            title: t('PAGES.PROJECT_DETAILS.KANBAN.BLOCKED'),
            count: 3,
            status: 'blocked',
          },
          {
            title: t('PAGES.PROJECT_DETAILS.KANBAN.FINAL_CHECK'),
            count: 5,
            status: 'final-check',
          },
        ].map((column) => (
          <div
            key={column.status}
            className="w-80 min-w-80 flex-shrink-0 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white">
              <h3 className="p-4 text-sm font-medium text-gray-900">
                {column.title} ({column.count})
              </h3>
            </div>
            <div className="space-y-3 rounded-b-lg bg-gray-50 p-4">
              {tasks
                .filter((task) => task.status === column.status)
                .slice(0, 2)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              <Button variant="outline" className="w-full border-dashed">
                <Plus className="mr-2 h-4 w-4" />
                {t('PAGES.PROJECT_DETAILS.KANBAN.ADD_TASK')}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanView;
