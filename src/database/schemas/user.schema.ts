import { RxJsonSchema, RxCollection, RxDocument } from 'rxdb';
import {
  BaseDocType,
  baseSchemaProperties,
  baseRequiredFields,
} from './base.schema';

export interface UserDocType extends BaseDocType {
  name: string;
}

export const userSchema: RxJsonSchema<UserDocType> = {
  title: 'User Schema',
  description: 'User accounts',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    ...baseSchemaProperties,
    name: {
      type: 'string',
      maxLength: 100,
    },
  },
  required: [...baseRequiredFields, 'name'],
  indexes: ['name', 'created_at'],
};

export type UserDocument = RxDocument<UserDocType>;
export type UserCollection = RxCollection<UserDocType>;
