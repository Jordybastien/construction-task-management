import { useMutation } from './useMutation';
import { useInitUser } from '@/stores/auth.store';
import { loginUser } from '@/services/user';
import databaseManager from '@/database/manager';
import type { ErrorProps } from '@/utils/errorHandler';
import type { User } from '@/database/dtos/user.dto';

interface LoginVariables {
  name: string;
}

interface LoginResponse {
  user: User;
  token?: string;
}

interface UseLoginOptions {
  onSuccess?: (response: LoginResponse) => void | Promise<void>;
  onError?: (error: ErrorProps) => void | Promise<void>;
}

export function useLogin({ onError, onSuccess }: UseLoginOptions = {}) {
  const initUser = useInitUser();

  return useMutation(
    async ({ name }: LoginVariables) => {
      // Initialize database for this user before login
      await databaseManager.switchUserByName(name);
      const response = await loginUser({ name });
      return response;
    },
    {
      onSuccess: (response) => {
        initUser(response.user, response.token);
        onSuccess?.(response);
      },
      onError: (error) => {
        onError?.(error);
      },
    }
  );
}
