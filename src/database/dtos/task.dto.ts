import { BaseDocType, TaskStatus } from '../schemas/base.schema';

export interface Task extends BaseDocType {
  title: string;
  description?: string;
  room_id?: string;
  position_lat: number;
  position_lng: number;
  status: TaskStatus;
  created_by: string;
  assigned_to?: string;
  completed_at?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  room_id?: string;
  position_lat: number;
  position_lng: number;
  created_by: string;
  assigned_to?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  room_id?: string;
  position_lat?: number;
  position_lng?: number;
  status?: TaskStatus;
  assigned_to?: string;
}

export interface ChecklistItem extends BaseDocType {
  task_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  order_index: number;
  completed_at?: string;
}

export interface CreateChecklistItemDto {
  task_id: string;
  title: string;
  description?: string;
  order_index?: number;
}

export interface UpdateChecklistItemDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  order_index?: number;
}

export interface TaskProgress {
  completed: number;
  total: number;
  percentage: number;
}

export interface CreateChecklistItemDto {
  task_id: string;
  title: string;
  description?: string;
  order_index?: number;
}

export interface UpdateChecklistItemDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  order_index?: number;
}