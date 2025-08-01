import { RxJsonSchema, RxCollection, RxDocument } from 'rxdb';
import {
  BaseDocType,
  baseSchemaProperties,
  baseRequiredFields,
} from './base.schema';

export interface FloorPlanDocType extends BaseDocType {
  name: string;
  project_id: string;
  image_url: string;
  image_width: number;
  image_height: number;
  scale_pixels_per_meter: number;
  floor_level: number;
}

export const floorPlanSchema: RxJsonSchema<FloorPlanDocType> = {
  title: 'Floor Plan Schema',
  description: 'Building floor plans with coordinate systems',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    ...baseSchemaProperties,
    name: {
      type: 'string',
      maxLength: 100,
    },
    project_id: {
      type: 'string',
      maxLength: 36,
      ref: 'projects',
    },
    image_url: {
      type: 'string',
      maxLength: 500,
    },
    image_width: {
      type: 'number',
      minimum: 1,
      maximum: 10000,
    },
    image_height: {
      type: 'number',
      minimum: 1,
      maximum: 10000,
    },
    scale_pixels_per_meter: {
      type: 'number',
      minimum: 0.1,
      maximum: 1000,
      default: 50,
    },
    floor_level: {
      type: 'number',
      minimum: -10,
      maximum: 100,
      default: 0,
    },
  },
  required: [
    ...baseRequiredFields,
    'name',
    'project_id',
    'image_url',
    'image_width',
    'image_height',
  ],
  indexes: ['project_id', ['project_id', 'floor_level'], 'name'],
};

export type FloorPlanDocument = RxDocument<FloorPlanDocType>;
export type FloorPlanCollection = RxCollection<FloorPlanDocType>;
