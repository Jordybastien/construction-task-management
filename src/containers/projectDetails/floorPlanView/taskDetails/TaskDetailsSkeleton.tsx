import { Skeleton } from '@/components/ui/skeleton';

const TaskDetailsSkeleton = () => {
  return (
    <div className="flex h-full flex-col border-gray-200 bg-white p-4 lg:overflow-y-auto">
      <div className="space-y-4">
        {/* Task title and info skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Task status skeleton */}
        <Skeleton className="h-10 w-full rounded-lg" />

        {/* Checklist header skeleton */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-24" />
          </div>

          {/* Checklist items skeleton */}
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <div className="flex gap-1">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-6" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task history skeleton */}
        <div className="mt-6 space-y-3">
          <Skeleton className="h-8 w-full" />
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsSkeleton;