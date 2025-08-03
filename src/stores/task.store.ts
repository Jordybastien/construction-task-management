import { create } from 'zustand';
import type { TaskWithDetails } from '@/database/dtos/task.dto';

interface TaskState {
  tasks: TaskWithDetails[];
  selectedTask: TaskWithDetails | null;
  lastFetched: number | null;
}

interface TaskActions {
  setTasks: (tasks: TaskWithDetails[]) => void;
  setSelectedTask: (task: TaskWithDetails | null) => void;
  addTask: (task: TaskWithDetails) => void;
  updateTask: (id: string, updates: Partial<TaskWithDetails>) => void;
  updateTaskChecklistCounts: (taskId: string, completedCount: number, totalCount: number) => void;
  deleteTask: (id: string) => void;
  clearTasks: () => void;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  lastFetched: null,
};

const useTaskStore = create<TaskState & TaskActions>()((set) => ({
  ...initialState,

  setTasks: (tasks: TaskWithDetails[]) => {
    set({
      tasks,
      lastFetched: Date.now(),
    });
  },

  setSelectedTask: (task: TaskWithDetails | null) => {
    set({ selectedTask: task });
  },

  addTask: (task: TaskWithDetails) => {
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
  },

  updateTask: (id: string, updates: Partial<TaskWithDetails>) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
      selectedTask: state.selectedTask?.id === id 
        ? { ...state.selectedTask, ...updates }
        : state.selectedTask,
    }));
  },

  updateTaskChecklistCounts: (taskId: string, completedCount: number, totalCount: number) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId 
          ? { 
              ...task, 
              completed_checklist_count: completedCount,
              checklist_count: totalCount,
            } 
          : task
      ),
      selectedTask: state.selectedTask?.id === taskId 
        ? { 
            ...state.selectedTask, 
            completed_checklist_count: completedCount,
            checklist_count: totalCount,
          }
        : state.selectedTask,
    }));
  },

  deleteTask: (id: string) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
      selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
    }));
  },

  clearTasks: () => {
    set(initialState);
  },
}));

export const useTasks = () => useTaskStore((state) => state.tasks);
export const useSelectedTask = () => useTaskStore((state) => state.selectedTask);
export const useSetTasks = () => useTaskStore((state) => state.setTasks);
export const useSetSelectedTask = () => useTaskStore((state) => state.setSelectedTask);
export const useAddTask = () => useTaskStore((state) => state.addTask);
export const useUpdateTask = () => useTaskStore((state) => state.updateTask);
export const useUpdateTaskChecklistCounts = () => useTaskStore((state) => state.updateTaskChecklistCounts);
export const useDeleteTask = () => useTaskStore((state) => state.deleteTask);
export const useClearTasks = () => useTaskStore((state) => state.clearTasks);