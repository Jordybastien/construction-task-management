import withApi from './apiHelper';
import type { FloorPlan, CreateFloorPlanDto, UpdateFloorPlanDto, FloorPlanWithStats } from '@/database/dtos/floorPlan.dto';

export const fetchFloorPlansByProject = async (projectId: string): Promise<FloorPlanWithStats[]> => {
  return await withApi(
    (api) => api.get(`/floor-plans/project/${projectId}`),
    async (db) => {
      return await db.floorPlans.findFloorPlansByProjectWithStats(projectId);
    }
  );
};

export const createFloorPlan = async (payload: CreateFloorPlanDto): Promise<FloorPlan> => {
  return await withApi(
    (api) => api.post('/floor-plans', payload),
    async (db) => {
      const floorPlanDoc = await db.floorPlans.createFloorPlan(payload);
      return floorPlanDoc.toJSON() as FloorPlan;
    }
  );
};

export const updateFloorPlan = async (floorPlanId: string, payload: UpdateFloorPlanDto): Promise<FloorPlan> => {
  return await withApi(
    (api) => api.put(`/floor-plans/${floorPlanId}`, payload),
    async (db) => {
      const floorPlanDoc = await db.floorPlans.updateFloorPlan(floorPlanId, payload);
      return floorPlanDoc?.toJSON() as FloorPlan;
    }
  );
};

export const deleteFloorPlan = async (floorPlanId: string): Promise<void> => {
  return await withApi(
    (api) => api.delete(`/floor-plans/${floorPlanId}`),
    async (db) => {
      await db.floorPlans.deleteFloorPlan(floorPlanId);
    }
  );
};

export const fetchFloorPlanById = async (floorPlanId: string): Promise<FloorPlan> => {
  return await withApi(
    (api) => api.get(`/floor-plans/${floorPlanId}`),
    async (db) => {
      const floorPlanDoc = await db.floorPlans.findFloorPlanById(floorPlanId);
      return floorPlanDoc?.toJSON() as FloorPlan;
    }
  );
};