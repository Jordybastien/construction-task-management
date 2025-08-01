import type { AxiosInstance } from 'axios';
import type { DatabaseServices } from '@/database/services';
import { createDatabase } from '@/database';
import { DatabaseServices as DbServices } from '@/database/services';
import databaseManager from '@/database/manager';
import { formatApiErrorResponse } from '@/utils/errorHandler';
import { LOCAL_STORAGE_IDENTIFIERS } from '@/utils/constants';

let dbServices: DatabaseServices | null = null;

const ensureDatabaseInitialized = async (): Promise<DatabaseServices> => {
  if (dbServices) {
    return dbServices;
  }

  let userId = databaseManager.getCurrentUserId();

  // If no user in memory, get from localStorage (handles page reload)
  if (!userId) {
    const storedUser = localStorage.getItem(
      LOCAL_STORAGE_IDENTIFIERS.USER_STORE_KEY
    );
    const user = storedUser ? JSON.parse(storedUser) : null;

    // user from current session
    if (user?.name) {
      await databaseManager.switchUserByName(user.name);
      userId = databaseManager.getCurrentUserId();
    }
  }

  if (!userId) {
    throw new Error('No user authenticated - cannot initialize database');
  }

  const database = await createDatabase(userId);
  dbServices = new DbServices(database);
  return dbServices;
};

export const resetDatabaseServices = () => {
  dbServices = null;
};

const withApi = async <T>(
  callback: (api: AxiosInstance) => Promise<{ data: T }>,
  fallbackFn?: (db: DatabaseServices) => Promise<T>
): Promise<T> => {
  // TODO: This is an ugly implementation but it's a short-circuit to this function to allow it to work fully offline on demand
  if (import.meta.env.VITE_OFFLINE_MODE === 'true' && fallbackFn) {
    try {
      const db = await ensureDatabaseInitialized();
      return await fallbackFn(db);
    } catch (error) {
      throw formatApiErrorResponse(error);
    }
  }

  // Fallback when offline mode is not enabled
  throw new Error(
    'API calls are currently disabled. Enable offline mode or uncomment API logic.'
  );

  // TODO: Uncomment this to dynamically check on/off-line functionality
  // try {
  //   const { default: api } = await import('@/services/api');
  //   const response = await callback(api);
  //   return response.data;
  // } catch (error) {
  //   const { formatApiErrorResponse } = await import('@/utils/errorHandler');
  //   const formattedError = formatApiErrorResponse(error);

  //   if (formattedError.isNetworkError && fallbackFn) {
  //     try {
  //       const db = await ensureDatabaseInitialized();
  //       return await fallbackFn(db);
  //     } catch (fallbackError) {
  //       throw formattedError;
  //     }
  //   }

  //   throw formattedError;
  // }
};

export default withApi;
