import withApi from './apiHelper';
import type { Room, CreateRoomDto, UpdateRoomDto, RoomWithStats } from '@/database/dtos/room.dto';

export const fetchRoomsByFloorPlan = async (floorPlanId: string): Promise<RoomWithStats[]> => {
  return await withApi(
    (api) => api.get(`/rooms/floor-plan/${floorPlanId}`),
    async (db) => {
      return await db.rooms.findRoomsByFloorPlanWithStats(floorPlanId);
    }
  );
};

export const createRoom = async (payload: CreateRoomDto): Promise<Room> => {
  return await withApi(
    (api) => api.post('/rooms', payload),
    async (db) => {
      const roomDoc = await db.rooms.createRoom(payload);
      return roomDoc.toJSON() as Room;
    }
  );
};

export const updateRoom = async (roomId: string, payload: UpdateRoomDto): Promise<Room> => {
  return await withApi(
    (api) => api.put(`/rooms/${roomId}`, payload),
    async (db) => {
      const roomDoc = await db.rooms.updateRoom(roomId, payload);
      return roomDoc?.toJSON() as Room;
    }
  );
};

export const deleteRoom = async (roomId: string): Promise<void> => {
  return await withApi(
    (api) => api.delete(`/rooms/${roomId}`),
    async (db) => {
      await db.rooms.deleteRoom(roomId);
    }
  );
};

export const fetchRoomById = async (roomId: string): Promise<Room> => {
  return await withApi(
    (api) => api.get(`/rooms/${roomId}`),
    async (db) => {
      const roomDoc = await db.rooms.findRoomById(roomId);
      return roomDoc?.toJSON() as Room;
    }
  );
};