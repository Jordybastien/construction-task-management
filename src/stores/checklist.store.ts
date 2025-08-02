import { create } from 'zustand';
import { TaskStatus } from '@/database/schemas/base.schema';
import type { ChecklistItem } from '@/database/dtos/task.dto';

interface ChecklistState {
  checklistsByTask: Record<string, ChecklistItem[]>;
  lastFetchedByTask: Record<string, number>;
}

interface ChecklistActions {
  setChecklistItems: (taskId: string, items: ChecklistItem[]) => void;
  addChecklistItem: (taskId: string, item: ChecklistItem) => void;
  updateChecklistItem: (taskId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
  deleteChecklistItem: (taskId: string, itemId: string) => void;
  clearChecklistForTask: (taskId: string) => void;
  clearAllChecklists: () => void;
}

const initialState: ChecklistState = {
  checklistsByTask: {},
  lastFetchedByTask: {},
};

const useChecklistStore = create<ChecklistState & ChecklistActions>()((set) => ({
  ...initialState,

  setChecklistItems: (taskId: string, items: ChecklistItem[]) => {
    set((state) => ({
      checklistsByTask: {
        ...state.checklistsByTask,
        [taskId]: items,
      },
      lastFetchedByTask: {
        ...state.lastFetchedByTask,
        [taskId]: Date.now(),
      },
    }));
  },

  addChecklistItem: (taskId: string, item: ChecklistItem) => {
    set((state) => ({
      checklistsByTask: {
        ...state.checklistsByTask,
        [taskId]: [...(state.checklistsByTask[taskId] || []), item],
      },
    }));
  },

  updateChecklistItem: (taskId: string, itemId: string, updates: Partial<ChecklistItem>) => {
    set((state) => ({
      checklistsByTask: {
        ...state.checklistsByTask,
        [taskId]: (state.checklistsByTask[taskId] || []).map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      },
    }));
  },

  deleteChecklistItem: (taskId: string, itemId: string) => {
    set((state) => ({
      checklistsByTask: {
        ...state.checklistsByTask,
        [taskId]: (state.checklistsByTask[taskId] || []).filter((item) => item.id !== itemId),
      },
    }));
  },

  clearChecklistForTask: (taskId: string) => {
    set((state) => {
      const newChecklistsByTask = { ...state.checklistsByTask };
      const newLastFetchedByTask = { ...state.lastFetchedByTask };
      delete newChecklistsByTask[taskId];
      delete newLastFetchedByTask[taskId];
      
      return {
        checklistsByTask: newChecklistsByTask,
        lastFetchedByTask: newLastFetchedByTask,
      };
    });
  },

  clearAllChecklists: () => {
    set(initialState);
  },
}));

export const useChecklistByTask = (taskId: string) => 
  useChecklistStore((state) => state.checklistsByTask[taskId]);

export const getChecklistByTaskFromStore = (taskId: string) => 
  useChecklistStore.getState().checklistsByTask[taskId];

export const useSetChecklistItems = () => 
  useChecklistStore((state) => state.setChecklistItems);

export const useAddChecklistItem = () => 
  useChecklistStore((state) => state.addChecklistItem);

export const useUpdateChecklistItem = () => 
  useChecklistStore((state) => state.updateChecklistItem);

export const useDeleteChecklistItem = () => 
  useChecklistStore((state) => state.deleteChecklistItem);

export const useClearChecklistForTask = () => 
  useChecklistStore((state) => state.clearChecklistForTask);

export const useClearAllChecklists = () => 
  useChecklistStore((state) => state.clearAllChecklists);

// Utility function to calculate checklist counts for a task
export const calculateChecklistCounts = (checklistItems?: ChecklistItem[]) => {
  const completedCount = checklistItems?.filter(item => item.status === TaskStatus.DONE).length || 0;
  const totalCount = checklistItems?.length || 0;
  return { completedCount, totalCount };
};