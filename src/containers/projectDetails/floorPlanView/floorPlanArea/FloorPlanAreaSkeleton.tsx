import { Skeleton } from '@/components/ui/skeleton';

const FloorPlanAreaSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>

      <Skeleton className="h-[300px] w-full rounded-lg" />

      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloorPlanAreaSkeleton;
