import { BaseService } from './base.service';
import type { ChecklistItemDocument } from '../schemas/checklistItem.schema';
import type {
  ChecklistItem,
  CreateChecklistItemDto,
  UpdateChecklistItemDto,
} from '../dtos/task.dto';
import { TaskStatus } from '../schemas/base.schema';
import { DatabaseError } from '../errors/database-error';

export class ChecklistService extends BaseService {
  async createChecklistItem(
    dto: CreateChecklistItemDto
  ): Promise<ChecklistItemDocument> {
    try {
      const orderIndex =
        dto.order_index ?? (await this.getNextOrderIndex(dto.task_id));

      const checklistData: ChecklistItem = {
        id: this.generateId(),
        ...dto,
        order_index: orderIndex,
        status: TaskStatus.NOT_STARTED,
        ...this.createAuditTrail(),
      };

      return await this.db.checklist_items.insert(checklistData);
    } catch (error) {
      this.handleError(error, 'createChecklistItem');
    }
  }

  async findChecklistItemById(
    id: string
  ): Promise<ChecklistItemDocument | null> {
    try {
      return await this.db.checklist_items.findOne(id).exec();
    } catch (error) {
      this.handleError(error, 'findChecklistItemById');
    }
  }

  async findChecklistItemsByTask(
    taskId: string
  ): Promise<ChecklistItemDocument[]> {
    try {
      return await this.db.checklist_items
        .find({
          selector: { task_id: taskId },
          sort: [{ order_index: 'asc' }],
        })
        .exec();
    } catch (error) {
      this.handleError(error, 'findChecklistItemsByTask');
    }
  }

  async updateChecklistItem(
    id: string,
    updates: UpdateChecklistItemDto
  ): Promise<ChecklistItemDocument> {
    try {
      const item = await this.findChecklistItemById(id);
      if (!item) {
        throw new Error(`Checklist item with id ${id} not found`);
      }

      const updateData: any = {
        ...updates,
        ...this.updateAuditTrail(),
      };

      if (
        updates.status === TaskStatus.DONE &&
        item.status !== TaskStatus.DONE
      ) {
        updateData.completed_at = this.getCurrentTimestamp();
      }

      return await item.update({
        $set: updateData,
      });
    } catch (error) {
      this.handleError(error, 'updateChecklistItem');
    }
  }

  async updateChecklistItemStatus(
    id: string,
    status: TaskStatus
  ): Promise<ChecklistItemDocument> {
    return this.updateChecklistItem(id, { status });
  }

  async deleteChecklistItem(id: string): Promise<boolean> {
    try {
      const item = await this.findChecklistItemById(id);
      if (!item) {
        return false;
      }

      await item.remove();

      await this.reorderAfterDeletion(item.task_id);

      return true;
    } catch (error) {
      this.handleError(error, 'deleteChecklistItem');
    }
  }

  async reorderChecklistItems(
    taskId: string,
    newOrder: string[]
  ): Promise<void> {
    try {
      for (let i = 0; i < newOrder.length; i++) {
        const item = await this.findChecklistItemById(newOrder[i]);
        // update order based on index in array
        if (item) {
          await item.update({
            $set: {
              order_index: i,
              ...this.updateAuditTrail(),
            },
          });
        }
      }
    } catch (error) {
      this.handleError(error, 'reorderChecklistItems');
    }
  }

  private async getNextOrderIndex(taskId: string): Promise<number> {
    try {
      const items = await this.findChecklistItemsByTask(taskId);
      return items.length;
    } catch (error) {
      return 0;
    }
  }

  private async reorderAfterDeletion(taskId: string): Promise<void> {
    try {
      const items = await this.findChecklistItemsByTask(taskId);

      for (let i = 0; i < items.length; i++) {
        // if order_index does not have the same index in the array it needs to be reordered to match it's position in the array
        if (items[i].order_index !== i) {
          await items[i].update({
            $set: {
              order_index: i,
              ...this.updateAuditTrail(),
            },
          });
        }
      }
    } catch (error) {
      this.handleError(error, 'reorderAfterDeletion');
    }
  }

  async moveChecklistItem(id: string, newIndex: number): Promise<void> {
    try {
      const item = await this.findChecklistItemById(id);
      if (!item) {
        throw DatabaseError.checklistItemNotFound(id);
      }

      const allItems = await this.findChecklistItemsByTask(item.task_id);
      const currentIndex = item.order_index;

      // Early exit if no move needed, meaning already has the same order
      if (currentIndex === newIndex) {
        return;
      }

      const reorderedIds = allItems.map((item) => item.id);
      // Remove the item from its current position
      const [movedId] = reorderedIds.splice(currentIndex, 1);
      // Insert the item at its new position
      reorderedIds.splice(newIndex, 0, movedId);

      // Apply the new ordering
      await this.reorderChecklistItems(item.task_id, reorderedIds);
    } catch (error) {
      this.handleError(error, 'moveChecklistItem');
    }
  }
}
