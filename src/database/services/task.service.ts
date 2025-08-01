import { BaseService } from './base.service';
import type { TaskDocument } from '../schemas/task.schema';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskProgress } from '../dtos/task.dto';
import { TaskStatus } from '../schemas/base.schema';
import { DatabaseError } from '../errors/database-error';

export class TaskService extends BaseService {
  async createTask(dto: CreateTaskDto): Promise<TaskDocument> {
    try {
      const taskData: Task = {
        id: this.generateId(),
        ...dto,
        status: TaskStatus.NOT_STARTED,
        ...this.createAuditTrail()
      };

      return await this.db.tasks.insert(taskData);
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

  async findTasksByRoom(roomId: string): Promise<TaskDocument[]> {
    try {
      return await this.db.tasks
        .find({
          selector: { room_id: roomId },
          sort: [{ created_at: 'desc' }]
        })
        .exec();
    } catch (error) {
      this.handleError(error, 'findTasksByRoom');
    }
  }

  async findTasksByStatus(status: TaskStatus): Promise<TaskDocument[]> {
    try {
      return await this.db.tasks
        .find({
          selector: { status },
          sort: [{ created_at: 'desc' }]
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
          sort: [{ created_at: 'desc' }]
        })
        .exec();
    } catch (error) {
      this.handleError(error, 'findTasksByAssignee');
    }
  }

  async updateTask(id: string, dto: UpdateTaskDto): Promise<TaskDocument> {
    try {
      const task = await this.findTaskById(id);
      if (!task) {
        throw DatabaseError.taskNotFound(id);
      }

      const updateData: any = {
        ...dto,
        ...this.updateAuditTrail()
      };

      if (dto.status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
        updateData.completed_at = this.getCurrentTimestamp();
      }

      return await task.update({
        $set: updateData
      });
    } catch (error) {
      this.handleError(error, 'updateTask');
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskDocument> {
    return this.updateTask(id, { status });
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const task = await this.findTaskById(id);
      if (!task) {
        return false;
      }

      await this.db.checklist_items
        .find({ selector: { task_id: id } })
        .remove();

      await this.db.task_comments
        .find({ selector: { task_id: id } })
        .remove();

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
          selector: { task_id: taskId }
        })
        .exec();

      const total = checklistItems.length;
      const completed = checklistItems.filter(item => item.status === TaskStatus.DONE).length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { completed, total, percentage };
    } catch (error) {
      this.handleError(error, 'getTaskProgress');
    }
  }
}