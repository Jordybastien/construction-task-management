import { create } from 'zustand';
import type { RoomWithStats } from '@/database/dtos/room.dto';

interface RoomState {
  roomsByFloorPlan: Record<string, RoomWithStats[]>;
  selectedRoom: RoomWithStats | null;
  lastFetchedByFloorPlan: Record<string, number>;
}

interface RoomActions {
  setRooms: (floorPlanId: string, rooms: RoomWithStats[]) => void;
  setSelectedRoom: (room: RoomWithStats | null) => void;
  addRoom: (floorPlanId: string, room: RoomWithStats) => void;
  updateRoom: (floorPlanId: string, roomId: string, updates: Partial<RoomWithStats>) => void;
  deleteRoom: (floorPlanId: string, roomId: string) => void;
  clearRoomsForFloorPlan: (floorPlanId: string) => void;
  clearAllRooms: () => void;
}

const initialState: RoomState = {
  roomsByFloorPlan: {},
  selectedRoom: null,
  lastFetchedByFloorPlan: {},
};

const useRoomStore = create<RoomState & RoomActions>()((set) => ({
  ...initialState,

  setRooms: (floorPlanId: string, rooms: RoomWithStats[]) => {
    set((state) => ({
      roomsByFloorPlan: {
        ...state.roomsByFloorPlan,
        [floorPlanId]: rooms,
      },
      lastFetchedByFloorPlan: {
        ...state.lastFetchedByFloorPlan,
        [floorPlanId]: Date.now(),
      },
    }));
  },

  setSelectedRoom: (room: RoomWithStats | null) => {
    set({ selectedRoom: room });
  },

  addRoom: (floorPlanId: string, room: RoomWithStats) => {
    set((state) => ({
      roomsByFloorPlan: {
        ...state.roomsByFloorPlan,
        [floorPlanId]: [...(state.roomsByFloorPlan[floorPlanId] || []), room],
      },
    }));
  },

  updateRoom: (floorPlanId: string, roomId: string, updates: Partial<RoomWithStats>) => {
    set((state) => ({
      roomsByFloorPlan: {
        ...state.roomsByFloorPlan,
        [floorPlanId]: (state.roomsByFloorPlan[floorPlanId] || []).map((room) =>
          room.id === roomId ? { ...room, ...updates } : room
        ),
      },
      selectedRoom: state.selectedRoom?.id === roomId 
        ? { ...state.selectedRoom, ...updates }
        : state.selectedRoom,
    }));
  },

  deleteRoom: (floorPlanId: string, roomId: string) => {
    set((state) => ({
      roomsByFloorPlan: {
        ...state.roomsByFloorPlan,
        [floorPlanId]: (state.roomsByFloorPlan[floorPlanId] || []).filter((room) => room.id !== roomId),
      },
      selectedRoom: state.selectedRoom?.id === roomId ? null : state.selectedRoom,
    }));
  },

  clearRoomsForFloorPlan: (floorPlanId: string) => {
    set((state) => {
      const newRoomsByFloorPlan = { ...state.roomsByFloorPlan };
      const newLastFetchedByFloorPlan = { ...state.lastFetchedByFloorPlan };
      delete newRoomsByFloorPlan[floorPlanId];
      delete newLastFetchedByFloorPlan[floorPlanId];
      
      return {
        roomsByFloorPlan: newRoomsByFloorPlan,
        lastFetchedByFloorPlan: newLastFetchedByFloorPlan,
      };
    });
  },

  clearAllRooms: () => {
    set(initialState);
  },
}));

export const useRoomsByFloorPlan = (floorPlanId: string) => 
  useRoomStore((state) => state.roomsByFloorPlan[floorPlanId]);

export const useSelectedRoom = () => 
  useRoomStore((state) => state.selectedRoom);

export const useSetRooms = () => 
  useRoomStore((state) => state.setRooms);

export const useSetSelectedRoom = () => 
  useRoomStore((state) => state.setSelectedRoom);

export const useAddRoom = () => 
  useRoomStore((state) => state.addRoom);

export const useUpdateRoom = () => 
  useRoomStore((state) => state.updateRoom);

export const useDeleteRoom = () => 
  useRoomStore((state) => state.deleteRoom);

export const useClearRoomsForFloorPlan = () => 
  useRoomStore((state) => state.clearRoomsForFloorPlan);

export const useClearAllRooms = () => 
  useRoomStore((state) => state.clearAllRooms);