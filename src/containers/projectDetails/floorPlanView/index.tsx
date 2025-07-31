import { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/models/task';
import { useParams } from 'react-router';
import TasksList from './tasksList';
import FloorPlanArea from './floorPlanArea';
import TaskDetails from './taskDetails';

const FloorPlanView = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tasks: Task[] = [
    {
      id: 1,
      title: 'Install Bathroom Fixtures',
      room: 'Bathroom 1',
      progress: 20,
      completedItems: 3,
      totalItems: 5,
      status: TaskStatus.BLOCKED,
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
      status: TaskStatus.NOT_STARTED,
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
    <div className="grid h-full grid-cols-[20rem_1fr_20rem] divide-x divide-gray-200 overflow-y-hidden">
      <TasksList 
        tasks={tasks} 
        selectedTask={selectedTask} 
        onTaskSelect={setSelectedTask} 
      />
      <FloorPlanArea className="sticky top-40" />
      <TaskDetails selectedTask={selectedTask} />
    </div>
  );
};

export default FloorPlanView;
