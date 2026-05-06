import { Skeleton } from "@/components/ui/Skeleton";

export default function EstatisticasLoading() {
  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <Skeleton className="h-8 w-56" />
      
      <Skeleton className="h-40 w-full rounded-3xl" />

      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-32 w-full rounded-3xl" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-32 w-full rounded-3xl" />
      </div>

      <Skeleton className="h-48 w-full rounded-3xl" />
    </div>
  );
}
