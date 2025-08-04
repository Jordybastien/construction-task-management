import { BaseDocType } from '../schemas/base.schema';

export interface FloorPlan extends BaseDocType {
  name: string;
  project_id: string;
  image_url: string;
  image_width: number;
  image_height: number;
  scale_pixels_per_meter: number;
  floor_level: number;
}

export interface CreateFloorPlanDto {
  name: string;
  project_id: string;
  image_url: string;
  image_width: number;
  image_height: number;
  scale_pixels_per_meter?: number;
  floor_level?: number;
}

export interface UpdateFloorPlanDto {
  name?: string;
  image_url?: string;
  image_width?: number;
  image_height?: number;
  scale_pixels_per_meter?: number;
  floor_level?: number;
}

export interface FloorPlanWithStats extends FloorPlan {
  taskCount: number;
  completedTasks: number;
  roomCount: number;
}

export const PREDEFINED_FLOOR_PLANS = [
  {
    id: 'plan-a',
    name: 'Small Office',
    image_url: '/assets/plans/1.png',
    image_width: 1536,
    image_height: 1024,
    scale_pixels_per_meter: 40,
    description:
      '20m x 15m office building with reception, offices, conference room',
    rooms: [
      {
        name: 'Storage Unit',
        boundary_coordinates:
          '[[125, 800], [590, 800], [590, 1336], [125, 1336]]',
      },
    ],
  },
  {
    id: 'plan-b',
    name: 'Residential House',
    image_url: '/assets/plans/2.png',
    image_width: 1536,
    image_height: 1024,
    scale_pixels_per_meter: 32,
    description: '25m x 18m house with living areas, bedrooms, bathrooms',
  },
  {
    id: 'plan-c',
    name: 'Small Warehouse',
    image_url: '/assets/plans/3.png',
    image_width: 1536,
    image_height: 1024,
    scale_pixels_per_meter: 24,
    description: '40m x 20m warehouse with storage, loading dock, office',
  },
  // {
  //   id: 'plan-d',
  //   name: 'Medical Clinic',
  //   image_url: '/assets/plans/4.png',
  //   image_width: 1200,
  //   image_height: 800,
  //   scale_pixels_per_meter: 32,
  //   description: '30m x 25m clinic with examination rooms, reception, offices'
  // }
];
