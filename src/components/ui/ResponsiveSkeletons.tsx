import { cn } from "@/lib/utils";

export function DataCardSkeleton() {
  return (
    <div className="bg-bg-glass border border-border-glass rounded-xl p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex flex-col gap-2.5">
        <div className="h-5 bg-muted/60 rounded-md w-3/4"></div>
        <div className="h-4 bg-muted/40 rounded-md w-1/2"></div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-3 pt-3 border-t border-border-glass/50">
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-muted/30 rounded w-16"></div>
          <div className="h-4 bg-muted/50 rounded w-24"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-muted/30 rounded w-16"></div>
          <div className="h-4 bg-muted/50 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function GridSkeletons({ count = 4 }: { count?: number }) {
  return (
    <>
      <div className="hidden md:flex flex-col gap-0 w-full border border-border-glass rounded-lg overflow-hidden animate-pulse bg-bg-glass">
         <div className="bg-background/40 h-12 w-full border-b border-border-glass"></div>
         {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="px-6 py-5 flex gap-8 border-b border-border-glass/50 last:border-0">
               <div className="h-4 bg-muted/60 rounded w-1/4"></div>
               <div className="h-4 bg-muted/40 rounded w-1/4"></div>
               <div className="h-4 bg-muted/30 rounded w-1/4"></div>
               <div className="h-4 bg-muted/50 rounded w-1/4"></div>
            </div>
         ))}
      </div>
      
      <div className="flex md:hidden flex-col gap-4 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <DataCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
