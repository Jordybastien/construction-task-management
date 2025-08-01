import { useState, useCallback, useEffect, useRef } from 'react';
import type { ErrorProps } from '@/utils/errorHandler';

interface QueryState {
  isLoading: boolean;
  isError: boolean;
  error: ErrorProps | null;
  isSuccess: boolean;
}

interface QueryOptions<T> {
  enabled?: boolean;
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: ErrorProps) => void | Promise<void>;
  onSettled?: (
    data: T | null,
    error: ErrorProps | null
  ) => void | Promise<void>;
}

interface QueryResult extends QueryState {
  refetch: () => Promise<void>;
}

// TODO: Implement automatic refetch after staleTime
// Inspired by TanStack Query's staleTime concept
// const STALE_TIME = 5 * 60 * 1000; // 5 minutes
// 
// Auto-refetch implementation (yet to be implemented):
// - Track lastFetched timestamp in store
// - Check if data is stale before manual refetch
// - Optionally add background refetch intervals

export function useQuery<T>(
  queryFn: () => Promise<T>,
  options: QueryOptions<T> = {}
): QueryResult {
  const [state, setState] = useState<QueryState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const { enabled = true } = options;
  const hasFetchedRef = useRef(false);

  const refetch = useCallback(
    async (): Promise<void> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
        isSuccess: false,
      }));

      try {
        const data = await queryFn();

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isSuccess: true,
        }));

        await options.onSuccess?.(data);
        await options.onSettled?.(data, null);
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
      }
    },
    [queryFn, options]
  );

  // Auto-fetch once when enabled becomes truthy
  // Ref ensures fetch only happens once per component lifecycle
  // No reset needed - page reload/unmount clears the ref naturally
  useEffect(() => {
    if (enabled && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      refetch();
    }
  }, [enabled]);

  return {
    ...state,
    refetch,
  };
}