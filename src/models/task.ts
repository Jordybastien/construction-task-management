export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  FINAL_CHECK = 'final_check',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}


export interface ChecklistItem {
  id: number;
  text: string;
  status: TaskStatus;
  completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  room: string;
  progress: number;
  completedItems: number;
  totalItems: number;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  lastUpdated: string;
  checklist: ChecklistItem[];
} 