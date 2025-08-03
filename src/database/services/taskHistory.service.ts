import { BaseService } from './base.service';
import type { TaskHistoryDocument } from '../schemas/taskHistory.schema';
import type {
  TaskHistory,
  CreateTaskHistoryDto,
  TaskHistoryWithDetails,
} from '../dtos/task.dto';
import { TaskStatus } from '../schemas/base.schema';

export class TaskHistoryService extends BaseService {
  async createTaskHistory(dto: CreateTaskHistoryDto): Promise<TaskHistoryDocument> {
    try {
      const taskHistoryData: TaskHistory = {
        id: this.generateId(),
        ...dto,
        ...this.createAuditTrail(),
      };

      return await this.db.task_history.insert(taskHistoryData);
    } catch (error) {
      this.handleError(error, 'createTaskHistory');
    }
  }

  async findTaskHistoryByTask(taskId: string): Promise<TaskHistoryDocument[]> {
    try {
      return await this.db.task_history
        .find({
          selector: { task_id: taskId },
          sort: [{ created_at: 'desc' }],
        })
        .exec();
    } catch (error) {
      this.handleError(error, 'findTaskHistoryByTask');
    }
  }

  async findTaskHistoryByTaskWithDetails(taskId: string): Promise<TaskHistoryWithDetails[]> {
    try {
      const historyDocs = await this.findTaskHistoryByTask(taskId);
      const historyWithDetails: TaskHistoryWithDetails[] = [];

      for (const historyDoc of historyDocs) {
        const history = historyDoc.toJSON() as TaskHistory;
        
        // Get user name
        let userName: string | undefined;
        if (history.user_id) {
          const user = await this.db.users.findOne(history.user_id).exec();
          userName = user?.name;
        }

        historyWithDetails.push({
          ...history,
          user_name: userName,
        });
      }

      return historyWithDetails;
    } catch (error) {
      this.handleError(error, 'findTaskHistoryByTaskWithDetails');
      return [];
    }
  }

  async logStatusChange(
    taskId: string,
    userId: string,
    oldStatus: TaskStatus,
    newStatus: TaskStatus
  ): Promise<TaskHistoryDocument> {
    return this.createTaskHistory({
      task_id: taskId,
      user_id: userId,
      old_status: oldStatus,
      new_status: newStatus,
    });
  }
}