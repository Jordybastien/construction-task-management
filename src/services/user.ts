import withApi from './apiHelper';
import type { User, CreateUserDto, UpdateUserDto } from '@/database/dtos/user.dto';

export const loginUser = async (payload: { name: string }): Promise<{ user: User; token?: string }> => {
  return await withApi(
    (api) => api.post('/auth/login', payload),
    async (db) => {
      // TODO: What happens when user get back online and we realize  user already exists 😂
      // Get back to this to find a better solution for this if it was a real app
      // Or just rely on ensuring signup should always be a real thing not offline.
      const userDoc = await db.users.findOrCreateUser({ name: payload.name });
      return {
        user: userDoc.toJSON() as User,
        token: `offline_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      };
    }
  );
};

export const createUser = async (payload: CreateUserDto): Promise<User> => {
  return await withApi(
    (api) => api.post('/users', payload),
    async (db) => {
      const userDoc = await db.users.createUser(payload);
      return userDoc.toJSON() as User;
    }
  );
};

export const updateUser = async (userId: string, payload: UpdateUserDto): Promise<User> => {
  return await withApi(
    (api) => api.put(`/users/${userId}`, payload),
    async (db) => {
      const userDoc = await db.users.updateUser(userId, payload);
      return userDoc?.toJSON() as User;
    }
  );
};

export const fetchUserById = async (userId: string): Promise<User> => {
  return await withApi(
    (api) => api.get(`/users/${userId}`),
    async (db) => {
      const userDoc = await db.users.findUserById(userId);
      return userDoc?.toJSON() as User;
    }
  );
};

export const deleteUser = async (userId: string): Promise<void> => {
  return await withApi(
    (api) => api.delete(`/users/${userId}`),
    async (db) => {
      await db.users.deleteUser(userId);
    }
  );
};