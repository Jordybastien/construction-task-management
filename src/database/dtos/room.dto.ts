import { BaseDocType, RoomType } from '../schemas/base.schema';

export interface Room extends BaseDocType {
  name: string;
  floor_plan_id: string;
  boundary_coordinates: string;
  room_type: RoomType;
  area_sqm?: number;
}

export interface CreateRoomDto {
  name: string;
  floor_plan_id: string;
  boundary_coordinates: string;
  room_type: RoomType;
  area_sqm?: number;
}

export interface UpdateRoomDto {
  name?: string;
  boundary_coordinates?: string;
  room_type?: RoomType;
  area_sqm?: number;
}

export interface RoomWithStats extends Room {
  task_count: number;
  completed_tasks: number;
  progress_percentage: number;
}