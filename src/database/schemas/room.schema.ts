import { RxJsonSchema, RxCollection, RxDocument } from 'rxdb';
import {
  BaseDocType,
  baseSchemaProperties,
  baseRequiredFields,
  RoomType,
} from './base.schema';

export interface RoomDocType extends BaseDocType {
  name: string;
  floor_plan_id: string;
  boundary_coordinates: string;
  room_type: RoomType;
  area_sqm?: number;
}

export const roomSchema: RxJsonSchema<RoomDocType> = {
  title: 'Room Schema',
  description: 'Room boundaries and metadata within floor plans',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    ...baseSchemaProperties,
    name: {
      type: 'string',
      maxLength: 100,
    },
    floor_plan_id: {
      type: 'string',
      maxLength: 36,
      ref: 'floor_plans',
    },
    boundary_coordinates: {
      type: 'string',
      maxLength: 5000,
    },
    room_type: {
      type: 'string',
      enum: Object.values(RoomType),
      default: RoomType.OTHER,
    },
    area_sqm: {
      type: 'number',
      minimum: 0,
      maximum: 10000,
    },
  },
  required: [
    ...baseRequiredFields,
    'name',
    'floor_plan_id',
    'boundary_coordinates',
    'room_type',
  ],
  indexes: [
    'floor_plan_id',
    'room_type',
    ['floor_plan_id', 'room_type'],
    'name',
  ],
};

export type RoomDocument = RxDocument<RoomDocType>;
export type RoomCollection = RxCollection<RoomDocType>;
export { RoomType };
