import { useState, useCallback } from 'react';
import type { ErrorProps } from '@/utils/errorHandler';

interface MutationState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: ErrorProps | null;
  isSuccess: boolean;
}

interface MutationOptions<T, P> {
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: ErrorProps) => void | Promise<void>;
  onSettled?: (
    data: T | null,
    error: ErrorProps | null
  ) => void | Promise<void>;
}

interface MutationResult<T, P> extends MutationState<T> {
  mutate: (variables: P) => Promise<void>;
  reset: () => void;
}

export function useMutation<T = unknown, P = unknown>(
  mutationFn: (variables: P) => Promise<T>,
  options: MutationOptions<T, P> = {}
): MutationResult<T, P> {
  const [state, setState] = useState<MutationState<T>>({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: false,
    });
  }, []);

  const mutateAsync = useCallback(
    async (variables: P): Promise<T> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
        isSuccess: false,
      }));

      try {
        const data = await mutationFn(variables);

        setState((prev) => ({
          ...prev,
          data,
          isLoading: false,
          isSuccess: true,
        }));

        await options.onSuccess?.(data);
        await options.onSettled?.(data, null);

        return data;
      } catch (error) {
        const errorProps = error as ErrorProps;

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isError: true,
          error: errorProps,
          isSuccess: false,
        }));

        await options.onError?.(errorProps);
        await options.onSettled?.(null, errorProps);

        throw error;
      }
    },
    [mutationFn, options]
  );

  const mutate = useCallback(
    async (variables: P): Promise<void> => {
      await mutateAsync(variables);
    },
    [mutateAsync]
  );

  return {
    ...state,
    mutate,
    reset,
  };
}
