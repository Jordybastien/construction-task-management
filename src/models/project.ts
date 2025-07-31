export enum ProjectStatus {
  ACTIVE = 'active',
  PLANNING = 'planning',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
}

export interface Project {
  id: number;
  title: string;
  status: ProjectStatus;
  taskCount: number;
  progress: number;
  lastUpdated: string;
}
