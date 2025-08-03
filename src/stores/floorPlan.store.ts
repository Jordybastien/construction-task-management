import { create } from 'zustand';
import type { FloorPlanWithStats } from '@/database/dtos/floorPlan.dto';

interface FloorPlanState {
  floorPlans: FloorPlanWithStats[];
  selectedFloorPlan: FloorPlanWithStats | null;
  lastFetched: number | null;
}

interface FloorPlanActions {
  setFloorPlans: (floorPlans: FloorPlanWithStats[]) => void;
  setSelectedFloorPlan: (floorPlan: FloorPlanWithStats | null) => void;
  addFloorPlan: (floorPlan: FloorPlanWithStats) => void;
  updateFloorPlan: (id: string, updates: Partial<FloorPlanWithStats>) => void;
  deleteFloorPlan: (id: string) => void;
  clearFloorPlans: () => void;
}

const initialState: FloorPlanState = {
  floorPlans: [],
  selectedFloorPlan: null,
  lastFetched: null,
};

const useFloorPlanStore = create<FloorPlanState & FloorPlanActions>()((set) => ({
  ...initialState,

  setFloorPlans: (floorPlans: FloorPlanWithStats[]) => {
    set({
      floorPlans,
      lastFetched: Date.now(),
    });
  },

  setSelectedFloorPlan: (floorPlan: FloorPlanWithStats | null) => {
    set({ selectedFloorPlan: floorPlan });
  },

  addFloorPlan: (floorPlan: FloorPlanWithStats) => {
    set((state) => ({
      floorPlans: [...state.floorPlans, floorPlan],
    }));
  },

  updateFloorPlan: (id: string, updates: Partial<FloorPlanWithStats>) => {
    set((state) => ({
      floorPlans: state.floorPlans.map((floorPlan) =>
        floorPlan.id === id ? { ...floorPlan, ...updates } : floorPlan
      ),
      selectedFloorPlan: state.selectedFloorPlan?.id === id 
        ? { ...state.selectedFloorPlan, ...updates }
        : state.selectedFloorPlan,
    }));
  },

  deleteFloorPlan: (id: string) => {
    set((state) => ({
      floorPlans: state.floorPlans.filter((floorPlan) => floorPlan.id !== id),
      selectedFloorPlan: state.selectedFloorPlan?.id === id ? null : state.selectedFloorPlan,
    }));
  },

  clearFloorPlans: () => {
    set(initialState);
  },
}));

export const useFloorPlans = () => useFloorPlanStore((state) => state.floorPlans);
export const useSelectedFloorPlan = () => useFloorPlanStore((state) => state.selectedFloorPlan);
export const useSetFloorPlans = () => useFloorPlanStore((state) => state.setFloorPlans);
export const useSetSelectedFloorPlan = () => useFloorPlanStore((state) => state.setSelectedFloorPlan);
export const useAddFloorPlan = () => useFloorPlanStore((state) => state.addFloorPlan);
export const useUpdateFloorPlan = () => useFloorPlanStore((state) => state.updateFloorPlan);
export const useDeleteFloorPlan = () => useFloorPlanStore((state) => state.deleteFloorPlan);
export const useClearFloorPlans = () => useFloorPlanStore((state) => state.clearFloorPlans);