import { BaseService } from './base.service';
import type { TaskDocument } from '../schemas/task.schema';
import type {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TaskProgress,
  TaskWithDetails,
  ChecklistItem,
} from '../dtos/task.dto';
import { TaskStatus } from '../schemas/base.schema';
import { DatabaseError } from '../errors/databaseErrors';

export class TaskService extends BaseService {
  async createTask(dto: CreateTaskDto): Promise<TaskDocument> {
    try {
      const taskData: Task = {
        id: this.generateId(),
        ...dto,
        status: TaskStatus.NOT_STARTED,
        ...this.createAuditTrail(),
      };

      const task = await this.db.tasks.insert(taskData);
      
      // Auto-create default checklist items
      await this.createDefaultChecklistItems(task.id);
      
      return task;
    } catch (error) {
      this.handleError(error, 'createTask');
    }
  }

  async findTaskById(id: string): Promise<TaskDocument | null> {
    try {
      return await this.db.tasks.findOne(id).exec();
    } catch (error) {
      this.handleError(error, 'findTaskById');
    }
  }

  async findTaskByIdWithDetails(id: string): Promise<TaskWithDetails | null> {
    try {
      const task = await this.findTaskById(id);
      if (!task) {
        return null;
      }

      return await this.enrichTaskWithDetails(task);
    } catch (error) {
      this.handleError(error, 'findTaskByIdWithDetails');
    }
  }

  async findTasksByRoom(roomId: string): Promise<TaskDocument[]> {
    try {
      return await this.db.tasks
        .find({
          selector: { room_id: roomId },
          sort: [{ created_at: 'desc' }],
        })
        .exec();
    } catch (error) {
      this.handleError(error, 'findTasksByRoom');
    }
  }

  async findTasksByRoomWithDetails(roomId: string): Promise<TaskWithDetails[]> {
    try {
      const tasks = await this.findTasksByRoom(roomId);
      const tasksWithDetails: TaskWithDetails[] = [];

      for (const taskDoc of tasks) {
        const enrichedTask = await this.enrichTaskWithDetails(taskDoc);
        if (enrichedTask) {
          tasksWithDetails.push(enrichedTask);
        }
      }

      return tasksWithDetails;
    } catch (error) {
      this.handleError(error, 'findTasksByRoomWithDetails');
      return [];
    }
  }

  async findTasksByFloorPlanWithDetails(floorPlanId: string): Promise<TaskWithDetails[]> {
    try {
      // First get all rooms in this floor plan
      const rooms = await this.db.rooms
        .find({
          selector: { floor_plan_id: floorPlanId }
        })
        .exec();

      const roomIds = rooms.map(room => room.id);
      const tasksWithDetails: TaskWithDetails[] = [];

      // Get all tasks for all rooms in this floor plan
      for (const roomId of roomIds) {
        const roomTasks = await this.findTasksByRoomWithDetails(roomId);
        tasksWithDetails.push(...roomTasks);
      }

      return tasksWithDetails;
    } catch (error) {
      this.handleError(error, 'findTasksByFloorPlanWithDetails');
      return [];
    }
  }

  async findTasksByStatus(status: TaskStatus): Promise<TaskDocument[]> {
    try {
      return await this.db.tasks
        .find({
          selector: { status },
          sort: [{ created_at: 'desc' }],
        })
        .exec();
    } catch (error) {
      this.handleError(error, 'findTasksByStatus');
    }
  }

  async findTasksByAssignee(userId: string): Promise<TaskDocument[]> {
    try {
      return await this.db.tasks
        .find({
          selector: { assigned_to: userId },
          sort: [{ created_at: 'desc' }],
        })
        .exec();
    } catch (error) {
      this.handleError(error, 'findTasksByAssignee');
    }
  }

  async updateTask(id: string, dto: UpdateTaskDto, userId?: string): Promise<TaskDocument> {
    try {
      const task = await this.findTaskById(id);
      if (!task) {
        throw DatabaseError.taskNotFound(id);
      }

      const oldStatus = task.status;
      const newStatus = dto.status;

      const updateData: any = {
        ...dto,
        ...this.updateAuditTrail(),
      };

      if (dto.status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
        updateData.completed_at = this.getCurrentTimestamp();
      }

      const updatedTask = await task.update({
        $set: updateData,
      });

      // Log status change if status changed and user is provided
      if (newStatus && oldStatus !== newStatus && userId) {
        await this.db.task_history.insert({
          id: this.generateId(),
          task_id: id,
          user_id: userId,
          old_status: oldStatus,
          new_status: newStatus,
          ...this.createAuditTrail(),
        });
      }

      return updatedTask;
    } catch (error) {
      this.handleError(error, 'updateTask');
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    userId?: string
  ): Promise<TaskDocument> {
    return this.updateTask(id, { status }, userId);
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const task = await this.findTaskById(id);
      if (!task) {
        return false;
      }

      // TODO: There should be a simpler function to delete all dependents
      await this.db.checklist_items
        .find({ selector: { task_id: id } })
        .remove();

      await this.db.task_comments.find({ selector: { task_id: id } }).remove();

      await task.remove();
      return true;
    } catch (error) {
      this.handleError(error, 'deleteTask');
    }
  }

  async getTaskProgress(taskId: string): Promise<TaskProgress> {
    try {
      const checklistItems = await this.db.checklist_items
        .find({
          selector: { task_id: taskId },
        })
        .exec();

      const total = checklistItems.length;
      const completed = checklistItems.filter(
        (item) => item.status === TaskStatus.DONE
      ).length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { completed, total, percentage };
    } catch (error) {
      this.handleError(error, 'getTaskProgress');
    }
  }

  private async enrichTaskWithDetails(taskDoc: TaskDocument): Promise<TaskWithDetails> {
    try {
      const task = taskDoc.toJSON() as Task;
      
      // @Note: Some spaghetti going on in here, in a backend framework we should be having
      // a simpler way with ORM to aggregate these details but for now, let's jut use this
      // Get room name if task has a room_id
      let roomName: string | undefined;
      if (task.room_id) {
        const room = await this.db.rooms.findOne(task.room_id).exec();
        roomName = room?.name;
      }

      // Get assigned user name if task has an assigned_to
      let assignedUserName: string | undefined;
      if (task.assigned_to) {
        const assignedUser = await this.db.users.findOne(task.assigned_to).exec();
        assignedUserName = assignedUser?.name;
      }

      // Get created user name
      let createdUserName: string | undefined;
      if (task.created_by) {
        const createdUser = await this.db.users.findOne(task.created_by).exec();
        createdUserName = createdUser?.name;
      }

      // Get checklist counts
      const checklistItems = await this.db.checklist_items
        .find({
          selector: { task_id: task.id }
        })
        .exec();

      const checklistCount = checklistItems.length;
      const completedChecklistCount = checklistItems.filter(
        item => item.status === TaskStatus.DONE
      ).length;

      return {
        ...task,
        room_name: roomName,
        assigned_user_name: assignedUserName,
        created_user_name: createdUserName,
        checklist_count: checklistCount,
        completed_checklist_count: completedChecklistCount,
      };
    } catch (error) {
      this.handleError(error, 'enrichTaskWithDetails');
      // Return basic task if enrichment fails
      return {
        ...taskDoc.toJSON() as Task,
        checklist_count: 0,
        completed_checklist_count: 0,
      };
    }
  }

  private async createDefaultChecklistItems(taskId: string): Promise<void> {
    try {
      const defaultItems = [
        {
          title: 'Safety check',
          description: 'Verify safety protocols and PPE requirements',
        },
        {
          title: 'Material delivery',
          description: 'Confirm all materials and tools are on site',
        },
        {
          title: 'Execute work',
          description: 'Complete the construction task as specified',
        },
        {
          title: 'Final inspection',
          description: 'Quality check and site cleanup',
        },
      ];

      for (let i = 0; i < defaultItems.length; i++) {
        const checklistData: ChecklistItem = {
          id: this.generateId(),
          task_id: taskId,
          title: defaultItems[i].title,
          description: defaultItems[i].description,
          order_index: i,
          status: TaskStatus.NOT_STARTED,
          ...this.createAuditTrail(),
        };

        await this.db.checklist_items.insert(checklistData);
      }
    } catch (error) {
      this.handleError(error, 'createDefaultChecklistItems');
    }
  }
}
