import { Skeleton } from "@/components/ui/Skeleton";

export default function ConfiguracoesLoading() {
  return (
    <div className="p-4 space-y-8 max-w-md mx-auto">
      <Skeleton className="h-8 w-48" />
      
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      ))}
    </div>
  );
}
