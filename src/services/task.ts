import withApi from './apiHelper';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskWithDetails, ChecklistItem, CreateChecklistItemDto, UpdateChecklistItemDto, TaskHistoryWithDetails } from '@/database/dtos/task.dto';

export const fetchTasksByFloorPlan = async (floorPlanId: string): Promise<TaskWithDetails[]> => {
  return await withApi(
    (api) => api.get(`/tasks/floor-plan/${floorPlanId}`),
    async (db) => {
      return await db.tasks.findTasksByFloorPlanWithDetails(floorPlanId);
    }
  );
};

export const fetchTasksByRoom = async (roomId: string): Promise<TaskWithDetails[]> => {
  return await withApi(
    (api) => api.get(`/tasks/room/${roomId}`),
    async (db) => {
      return await db.tasks.findTasksByRoomWithDetails(roomId);
    }
  );
};

export const createTask = async (payload: CreateTaskDto): Promise<Task> => {
  return await withApi(
    (api) => api.post('/tasks', payload),
    async (db) => {
      const taskDoc = await db.tasks.createTask(payload);
      return taskDoc.toJSON() as Task;
    }
  );
};

export const updateTask = async (taskId: string, payload: UpdateTaskDto, userId?: string): Promise<Task> => {
  return await withApi(
    (api) => api.put(`/tasks/${taskId}`, payload),
    async (db) => {
      const taskDoc = await db.tasks.updateTask(taskId, payload, userId);
      return taskDoc?.toJSON() as Task;
    }
  );
};

export const deleteTask = async (taskId: string): Promise<void> => {
  return await withApi(
    (api) => api.delete(`/tasks/${taskId}`),
    async (db) => {
      await db.tasks.deleteTask(taskId);
    }
  );
};

export const fetchTaskById = async (taskId: string): Promise<TaskWithDetails> => {
  return await withApi(
    (api) => api.get(`/tasks/${taskId}`),
    async (db) => {
      const taskDoc = await db.tasks.findTaskByIdWithDetails(taskId);
      return taskDoc as TaskWithDetails;
    }
  );
};

export const fetchChecklistItemsByTask = async (taskId: string): Promise<ChecklistItem[]> => {
  return await withApi(
    (api) => api.get(`/checklist-items/task/${taskId}`),
    async (db) => {
      return await db.checklist.findChecklistItemsByTask(taskId);
    }
  );
};

export const createChecklistItem = async (payload: CreateChecklistItemDto): Promise<ChecklistItem> => {
  return await withApi(
    (api) => api.post('/checklist-items', payload),
    async (db) => {
      const checklistDoc = await db.checklist.createChecklistItem(payload);
      return checklistDoc.toJSON() as ChecklistItem;
    }
  );
};

export const updateChecklistItem = async (checklistId: string, payload: UpdateChecklistItemDto, userId?: string): Promise<ChecklistItem> => {
  return await withApi(
    (api) => api.put(`/checklist-items/${checklistId}`, payload),
    async (db) => {
      const checklistDoc = await db.checklist.updateChecklistItem(checklistId, payload, userId);
      return checklistDoc?.toJSON() as ChecklistItem;
    }
  );
};

export const deleteChecklistItem = async (checklistId: string): Promise<void> => {
  return await withApi(
    (api) => api.delete(`/checklist-items/${checklistId}`),
    async (db) => {
      await db.checklist.deleteChecklistItem(checklistId);
    }
  );
};

export const fetchTaskHistoryByTask = async (taskId: string): Promise<TaskHistoryWithDetails[]> => {
  return await withApi(
    (api) => api.get(`/task-history/task/${taskId}`),
    async (db) => {
      return await db.taskHistory.findTaskHistoryByTaskWithDetails(taskId);
    }
  );
};