import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-4 space-y-8 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      <div className="flex justify-center py-6">
        <Skeleton className="h-64 w-64 rounded-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-14 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
