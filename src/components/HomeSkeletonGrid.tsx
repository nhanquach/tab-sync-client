import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const HomeSkeletonGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-500">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-md-sys-color-surface-container-low rounded-xl p-4 gap-3 border border-md-sys-color-outline-variant/20"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded bg-muted" />
            <div className="flex flex-col gap-1 flex-1">
              <Skeleton className="h-4 w-3/4 rounded bg-muted" />
              <Skeleton className="h-3 w-1/2 rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
