import { BaseService } from './base.service';
import type { FloorPlanDocument } from '../schemas/floorPlan.schema';
import type { FloorPlan, CreateFloorPlanDto, UpdateFloorPlanDto, FloorPlanWithStats } from '../dtos/floorPlan.dto';
import { DatabaseError } from '../errors/databaseErrors';

export class FloorPlanService extends BaseService {
  async createFloorPlan(dto: CreateFloorPlanDto): Promise<FloorPlanDocument> {
    try {
      // TODO: we're not creating floor plans for now so no worries for now, fix later
      // @ts-ignore
      const floorPlanData: FloorPlan = {
        id: this.generateId(),
        ...dto,
        ...this.createAuditTrail()
      };

      return await this.db.floor_plans.insert(floorPlanData);
    } catch (error) {
      this.handleError(error, 'createFloorPlan');
    }
  }

  async findFloorPlanById(id: string): Promise<FloorPlanDocument | null> {
    try {
      return await this.db.floor_plans.findOne(id).exec();
    } catch (error) {
      this.handleError(error, 'findFloorPlanById');
    }
  }

  async findFloorPlansByProject(projectId: string): Promise<FloorPlanDocument[]> {
    try {
      return await this.db.floor_plans
        .find({
          selector: { project_id: projectId },
          sort: [{ created_at: 'desc' }]
        })
        .exec();
    } catch (error) {
      this.handleError(error, 'findFloorPlansByProject');
    }
  }

  async findFloorPlansByProjectWithStats(projectId: string): Promise<FloorPlanWithStats[]> {
    try {
      const floorPlans = await this.findFloorPlansByProject(projectId);
      const floorPlansWithStats: FloorPlanWithStats[] = [];

      for (const floorPlanDoc of floorPlans) {
        const floorPlan = floorPlanDoc.toJSON();
        
        // Get rooms for this floor plan
        const rooms = await this.db.rooms
          .find({
            selector: { floor_plan_id: floorPlan.id }
          })
          .exec();

        const roomIds = rooms.map(room => room.id);
        
        // Get tasks for these rooms
        const tasks = await this.db.tasks
          .find({
            selector: {
              room_id: { $in: roomIds }
            }
          })
          .exec();

        const taskCount = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'done').length;
        
        floorPlansWithStats.push({
          ...floorPlan,
          taskCount,
          completedTasks,
          roomCount: rooms.length,
        });
      }

      return floorPlansWithStats;
    } catch (error) {
      this.handleError(error, 'findFloorPlansByProjectWithStats');
      return [];
    }
  }

  async updateFloorPlan(id: string, dto: UpdateFloorPlanDto): Promise<FloorPlanDocument> {
    try {
      const floorPlan = await this.findFloorPlanById(id);
      if (!floorPlan) {
        throw DatabaseError.floorPlanNotFound(id);
      }

      return await floorPlan.update({
        $set: {
          ...dto,
          ...this.updateAuditTrail()
        }
      });
    } catch (error) {
      this.handleError(error, 'updateFloorPlan');
    }
  }

  async deleteFloorPlan(id: string): Promise<boolean> {
    try {
      const floorPlan = await this.findFloorPlanById(id);
      if (!floorPlan) {
        return false;
      }

      // Delete related rooms and their tasks first
      const rooms = await this.db.rooms
        .find({
          selector: { floor_plan_id: id }
        })
        .exec();

      for (const room of rooms) {
        // Delete tasks in this room
        await this.db.tasks
          .find({ selector: { room_id: room.id } })
          .remove();
      }

      // Delete rooms
      await this.db.rooms
        .find({ selector: { floor_plan_id: id } })
        .remove();

      // Delete floor plan
      await floorPlan.remove();
      return true;
    } catch (error) {
      this.handleError(error, 'deleteFloorPlan');
      return false;
    }
  }
}