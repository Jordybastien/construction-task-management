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
  status?: TaskStatus;
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
  completed_at?: string;
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

export interface TaskWithDetails extends Task {
  room_name?: string;
  assigned_user_name?: string;
  created_user_name?: string;
  checklist_count: number;
  completed_checklist_count: number;
}

export interface TaskHistory extends BaseDocType {
  task_id: string;
  user_id: string;
  old_status: TaskStatus;
  new_status: TaskStatus;
  checklist_item_id?: string;
  checklist_item_name?: string;
}

export interface CreateTaskHistoryDto {
  task_id: string;
  user_id: string;
  old_status: TaskStatus;
  new_status: TaskStatus;
  checklist_item_id?: string;
  checklist_item_name?: string;
}

export interface TaskHistoryWithDetails extends TaskHistory {
  user_name?: string;
}