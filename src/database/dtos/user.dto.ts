import { BaseDocType } from '../schemas/base.schema';

export interface User extends BaseDocType {
  name: string;
}

export interface CreateUserDto {
  name: string;
}

export interface UpdateUserDto {
  name?: string;
}