import { Skeleton } from "@/components/ui/Skeleton";

export default function HistoricoLoading() {
  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <Skeleton className="h-8 w-40" />
      
      <div className="flex gap-2">
        <Skeleton className="h-10 w-20 rounded-full" />
        <Skeleton className="h-10 w-20 rounded-full" />
        <Skeleton className="h-10 w-20 rounded-full" />
      </div>

      <Skeleton className="h-48 w-full rounded-3xl" />

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
