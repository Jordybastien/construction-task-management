import { BaseService } from './base.service';
import type {
  ProjectDocument,
  ProjectWithStats,
} from '../schemas/project.schema';
import type {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectUser,
} from '../dtos/project.dto';
import type { FloorPlan } from '../dtos/floorPlan.dto';
import type { Room } from '../dtos/room.dto';
import { ProjectRole, ProjectStatus, RoomType } from '../schemas/base.schema';
import { PREDEFINED_FLOOR_PLANS } from '../dtos/floorPlan.dto';
import { DatabaseError } from '../errors/databaseErrors';

export class ProjectService extends BaseService {
  async createProject(dto: CreateProjectDto): Promise<ProjectDocument> {
    try {
      const projectData: Project = {
        id: this.generateId(),
        ...dto,
        status: dto.status || ProjectStatus.PLANNING,
        ...this.createAuditTrail(),
      };

      const project = await this.db.projects.insert(projectData);

      await this.addProjectUser(project.id, dto.created_by, ProjectRole.OWNER);

      // Auto-create default floor plan and room
      await this.createDefaultFloorPlanAndRoom(project.id);

      return project;
    } catch (error) {
      this.handleError(error, 'createProject');
    }
  }

  async findProjectById(id: string): Promise<ProjectDocument | null> {
    try {
      return await this.db.projects.findOne(id).exec();
    } catch (error) {
      this.handleError(error, 'findProjectById');
    }
  }

  async findProjectsByUser(userId: string): Promise<ProjectDocument[]> {
    try {
      const projectUsers = await this.db.project_users
        .find({
          selector: { user_id: userId },
        })
        .exec();

      const projectIds = projectUsers.map((pu) => pu.project_id);

      return await this.db.projects
        .find({
          selector: {
            id: { $in: projectIds },
          },
          sort: [{ created_at: 'desc' }],
        })
        .exec();
    } catch (error) {
      this.handleError(error, 'findProjectsByUser');
    }
  }

  async findProjectsByUserWithStats(
    userId: string
  ): Promise<ProjectWithStats[]> {
    try {
      const projects = await this.findProjectsByUser(userId);
      const projectsWithStats: ProjectWithStats[] = [];

      for (const projectDoc of projects) {
        const project = projectDoc.toJSON();
        const stats = await this.getProjectStats(project.id);

        projectsWithStats.push({
          ...project,
          taskCount: stats.taskCount,
          progress: stats.progress,
        });
      }

      return projectsWithStats;
    } catch (error) {
      this.handleError(error, 'findProjectsByUserWithStats');
    }
  }

  async updateProject(
    id: string,
    dto: UpdateProjectDto
  ): Promise<ProjectDocument> {
    try {
      const project = await this.findProjectById(id);
      if (!project) {
        throw DatabaseError.projectNotFound(id);
      }

      return await project.update({
        $set: {
          ...dto,
          ...this.updateAuditTrail(),
        },
      });
    } catch (error) {
      this.handleError(error, 'updateProject');
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const project = await this.findProjectById(id);
      if (!project) {
        return false;
      }

      await this.db.project_users
        .find({ selector: { project_id: id } })
        .remove();

      await project.remove();
      return true;
    } catch (error) {
      this.handleError(error, 'deleteProject');
    }
  }

  private async addProjectUser(
    projectId: string,
    userId: string,
    role: ProjectRole
  ): Promise<void> {
    try {
      const projectUserData: ProjectUser = {
        id: this.generateId(),
        project_id: projectId,
        user_id: userId,
        role,
        created_at: this.getCurrentTimestamp(),
      };

      await this.db.project_users.insert(projectUserData);
    } catch (error) {
      this.handleError(error, 'addProjectUser');
    }
  }

  async getUserRole(
    projectId: string,
    userId: string
  ): Promise<ProjectRole | null> {
    try {
      const projectUser = await this.db.project_users
        .findOne({
          selector: {
            project_id: projectId,
            user_id: userId,
          },
        })
        .exec();

      return projectUser?.role || null;
    } catch (error) {
      this.handleError(error, 'getUserRole');
    }
  }

  async getProjectStats(
    projectId: string
  ): Promise<{ taskCount: number; progress: number }> {
    try {
      // Get all floor plans for this project
      const floorPlans = await this.db.floor_plans
        .find({
          selector: { project_id: projectId },
        })
        .exec();

      const floorPlanIds = floorPlans.map((fp) => fp.id);

      // Get all rooms for these floor plans
      const rooms = await this.db.rooms
        .find({
          selector: {
            floor_plan_id: { $in: floorPlanIds },
          },
        })
        .exec();

      const roomIds = rooms.map((room) => room.id);

      // Get all tasks for these rooms
      const tasks = await this.db.tasks
        .find({
          selector: {
            room_id: { $in: roomIds },
          },
        })
        .exec();

      const taskCount = tasks.length;

      if (taskCount === 0) {
        return { taskCount: 0, progress: 0 };
      }

      // Calculate average progress across all tasks
      let totalProgress = 0;

      for (const task of tasks) {
        const checklistItems = await this.db.checklist_items
          .find({
            selector: { task_id: task.id },
          })
          .exec();

        const completedItems = checklistItems.filter(
          (item) => item.status === 'done'
        ).length;
        const taskProgress =
          checklistItems.length > 0
            ? (completedItems / checklistItems.length) * 100
            : 0;

        totalProgress += taskProgress;
      }

      const averageProgress = Math.round(totalProgress / taskCount);

      return { taskCount, progress: averageProgress };
    } catch (error) {
      this.handleError(error, 'getProjectStats');
      return { taskCount: 0, progress: 0 };
    }
  }

  private async createDefaultFloorPlanAndRoom(
    projectId: string
  ): Promise<void> {
    try {
      // Use the first predefined floor plan as default
      const defaultPlan = PREDEFINED_FLOOR_PLANS[0];

      // Create default floor plan
      const floorPlanData: FloorPlan = {
        id: this.generateId(),
        name: 'Ground Floor',
        project_id: projectId,
        image_url: defaultPlan.image_url,
        image_width: defaultPlan.image_width,
        image_height: defaultPlan.image_height,
        scale_pixels_per_meter: defaultPlan.scale_pixels_per_meter,
        floor_level: 0,
        ...this.createAuditTrail(),
      };

      const floorPlan = await this.db.floor_plans.insert(floorPlanData);

      // Create default room
      const roomData: Room = {
        id: this.generateId(),
        name: 'Storage Unit',
        floor_plan_id: floorPlan.id,
        // @ts-ignore @Note: it will never be null it's a constant
        boundary_coordinates: defaultPlan.rooms[0]?.boundary_coordinates, // Simple rectangle coordinates
        room_type: RoomType.LIVING_ROOM,
        area_sqm: 25,
        ...this.createAuditTrail(),
      };

      await this.db.rooms.insert(roomData);
    } catch (error) {
      this.handleError(error, 'createDefaultFloorPlanAndRoom');
    }
  }
}
