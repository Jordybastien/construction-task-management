import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import databaseManager from '@/database/manager';
import { resetDatabaseServices } from '@/services/apiHelper';
import type { User } from '@/database/dtos/user.dto';
import { LOCAL_STORAGE_IDENTIFIERS, storeKeys } from '@/utils/constants';
import { deleteToken } from '@/utils/session';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User, token?: string) => void;
  logout: () => Promise<void>;
  initializeFromStorage: () => Promise<void>;
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user: User, token?: string) => {
        databaseManager.switchUserByName(user.name);

        set({
          user,
          token: token || null,
          isAuthenticated: true,
        });

        if (token) {
          localStorage.setItem(
            LOCAL_STORAGE_IDENTIFIERS.TOKEN_STORE_KEY,
            token
          );
        }
        localStorage.setItem(
          LOCAL_STORAGE_IDENTIFIERS.USER_STORE_KEY,
          JSON.stringify(user)
        );
      },

      logout: async () => {
        await databaseManager.close();
        resetDatabaseServices();
        deleteToken();
        // No need to manually clear Zustand stores - window.location.href 
        // reloads the page which clears all memory state automatically
        window.location.href = '/';
      },

      initializeFromStorage: async () => {
        const storedUser = localStorage.getItem(
          LOCAL_STORAGE_IDENTIFIERS.USER_STORE_KEY
        );
        const storedToken = localStorage.getItem(
          LOCAL_STORAGE_IDENTIFIERS.TOKEN_STORE_KEY
        );

        if (storedUser && storedToken) {
          try {
            const user = JSON.parse(storedUser) as User;

            await databaseManager.switchUserByName(user.name);

            set({
              user,
              token: storedToken,
              isAuthenticated: true,
            });
          } catch (error) {
            deleteToken();
          }
        }
      },
    }),
    {
      name: storeKeys.AUTH_STORAGE,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useInitializeFromStorage = () =>
  useAuthStore((state) => state.initializeFromStorage);

export const isUserAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useLogoutUser = () => useAuthStore((state) => state.logout);
export const useInitUser = () => useAuthStore((state) => state.setUser);
