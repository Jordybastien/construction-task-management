import { create } from 'zustand';
import type { TaskHistoryWithDetails } from '@/database/dtos/task.dto';

interface TaskHistoryState {
  taskHistories: Record<string, TaskHistoryWithDetails[]>;
  lastFetchedByTask: Record<string, number>;
}

interface TaskHistoryActions {
  setTaskHistories: (taskId: string, histories: TaskHistoryWithDetails[]) => void;
  addTaskHistory: (taskId: string, history: TaskHistoryWithDetails) => void;
  clearTaskHistories: (taskId: string) => void;
  clearAllTaskHistories: () => void;
}

const initialState: TaskHistoryState = {
  taskHistories: {},
  lastFetchedByTask: {},
};

const useTaskHistoryStore = create<TaskHistoryState & TaskHistoryActions>()((set) => ({
  ...initialState,

  setTaskHistories: (taskId: string, histories: TaskHistoryWithDetails[]) => {
    set((state) => ({
      taskHistories: {
        ...state.taskHistories,
        [taskId]: histories,
      },
      lastFetchedByTask: {
        ...state.lastFetchedByTask,
        [taskId]: Date.now(),
      },
    }));
  },

  addTaskHistory: (taskId: string, history: TaskHistoryWithDetails) => {
    set((state) => ({
      taskHistories: {
        ...state.taskHistories,
        [taskId]: [history, ...(state.taskHistories[taskId] || [])],
      },
    }));
  },

  clearTaskHistories: (taskId: string) => {
    set((state) => {
      const newTaskHistories = { ...state.taskHistories };
      const newLastFetchedByTask = { ...state.lastFetchedByTask };
      delete newTaskHistories[taskId];
      delete newLastFetchedByTask[taskId];
      
      return {
        taskHistories: newTaskHistories,
        lastFetchedByTask: newLastFetchedByTask,
      };
    });
  },

  clearAllTaskHistories: () => {
    set(initialState);
  },
}));

export const useTaskHistoriesByTask = (taskId: string) => 
  useTaskHistoryStore((state) => state.taskHistories[taskId]);

export const useSetTaskHistories = () => 
  useTaskHistoryStore((state) => state.setTaskHistories);

export const useAddTaskHistory = () => 
  useTaskHistoryStore((state) => state.addTaskHistory);

export const useClearTaskHistories = () => 
  useTaskHistoryStore((state) => state.clearTaskHistories);

export const useClearAllTaskHistories = () => 
  useTaskHistoryStore((state) => state.clearAllTaskHistories);

export default useTaskHistoryStore;