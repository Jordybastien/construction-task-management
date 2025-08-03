import { BaseService } from './base.service';
import type { RoomDocument } from '../schemas/room.schema';
import type { Room, CreateRoomDto, UpdateRoomDto, RoomWithStats } from '../dtos/room.dto';
import { DatabaseError } from '../errors/databaseErrors';

export class RoomService extends BaseService {
  async createRoom(dto: CreateRoomDto): Promise<RoomDocument> {
    try {
      const roomData: Room = {
        id: this.generateId(),
        ...dto,
        ...this.createAuditTrail()
      };

      return await this.db.rooms.insert(roomData);
    } catch (error) {
      this.handleError(error, 'createRoom');
    }
  }

  async findRoomById(id: string): Promise<RoomDocument | null> {
    try {
      return await this.db.rooms.findOne(id).exec();
    } catch (error) {
      this.handleError(error, 'findRoomById');
    }
  }

  async findRoomsByFloorPlan(floorPlanId: string): Promise<RoomDocument[]> {
    try {
      return await this.db.rooms
        .find({
          selector: { floor_plan_id: floorPlanId },
          sort: [{ created_at: 'desc' }]
        })
        .exec();
    } catch (error) {
      this.handleError(error, 'findRoomsByFloorPlan');
    }
  }

  async findRoomsByFloorPlanWithStats(floorPlanId: string): Promise<RoomWithStats[]> {
    try {
      const rooms = await this.findRoomsByFloorPlan(floorPlanId);
      const roomsWithStats: RoomWithStats[] = [];

      for (const roomDoc of rooms) {
        const room = roomDoc.toJSON();
        
        // Get tasks for this room
        const tasks = await this.db.tasks
          .find({
            selector: { room_id: room.id }
          })
          .exec();

        const taskCount = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'done').length;
        const progressPercentage = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;
        
        roomsWithStats.push({
          ...room,
          task_count: taskCount,
          completed_tasks: completedTasks,
          progress_percentage: progressPercentage,
        });
      }

      return roomsWithStats;
    } catch (error) {
      this.handleError(error, 'findRoomsByFloorPlanWithStats');
      return [];
    }
  }

  async updateRoom(id: string, dto: UpdateRoomDto): Promise<RoomDocument> {
    try {
      const room = await this.findRoomById(id);
      if (!room) {
        throw DatabaseError.roomNotFound(id);
      }

      return await room.update({
        $set: {
          ...dto,
          ...this.updateAuditTrail()
        }
      });
    } catch (error) {
      this.handleError(error, 'updateRoom');
    }
  }

  async deleteRoom(id: string): Promise<boolean> {
    try {
      const room = await this.findRoomById(id);
      if (!room) {
        return false;
      }

      // Delete related tasks first
      await this.db.tasks
        .find({
          selector: { room_id: id }
        })
        .remove();

      // Delete room
      await room.remove();
      return true;
    } catch (error) {
      this.handleError(error, 'deleteRoom');
      return false;
    }
  }
}