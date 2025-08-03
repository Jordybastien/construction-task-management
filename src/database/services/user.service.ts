import { BaseService } from './base.service';
import type { UserDocument } from '../schemas/user.schema';
import type { User, CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { DatabaseError } from '../errors/databaseErrors';

export class UserService extends BaseService {
  async createUser(dto: CreateUserDto): Promise<UserDocument> {
    try {
      if (!dto.name?.trim()) {
        throw DatabaseError.invalidInput('name', dto.name);
      }

      const existingUser = await this.findUserByName(dto.name);
      if (existingUser) {
        throw DatabaseError.userAlreadyExists(dto.name);
      }

      const userData: User = {
        id: this.generateId(),
        name: dto.name.trim(),
        ...this.createAuditTrail(),
      };

      return await this.db.users.insert(userData);
    } catch (error) {
      this.handleError(error, 'createUser');
    }
  }

  async findUserByName(name: string): Promise<UserDocument | null> {
    try {
      return await this.db.users
        .findOne({
          selector: { name },
        })
        .exec();
    } catch (error) {
      this.handleError(error, 'findUserByName');
    }
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    try {
      return await this.db.users.findOne(id).exec();
    } catch (error) {
      this.handleError(error, 'findUserById');
    }
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    try {
      const user = await this.findUserById(id);
      if (!user) {
        throw DatabaseError.userNotFound(id);
      }

      if (dto.name && dto.name !== user.name) {
        const existingUser = await this.findUserByName(dto.name);
        if (existingUser && existingUser.id !== id) {
          throw DatabaseError.userAlreadyExists(dto.name);
        }
      }

      return await user.update({
        $set: {
          ...dto,
          ...this.updateAuditTrail(),
        },
      });
    } catch (error) {
      this.handleError(error, 'updateUser');
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const user = await this.findUserById(id);
      if (!user) {
        return false;
      }

      await user.remove();
      return true;
    } catch (error) {
      this.handleError(error, 'deleteUser');
    }
  }

  async findOrCreateUser(dto: CreateUserDto): Promise<UserDocument> {
    try {
      let user = await this.findUserByName(dto.name);

      if (!user) {
        user = await this.createUser(dto);
      }

      return user;
    } catch (error) {
      this.handleError(error, 'findOrCreateUser');
    }
  }
}
