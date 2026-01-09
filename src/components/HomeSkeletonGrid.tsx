import React from "react";
import { ShimmerCard } from "@/components/ui/shimmer-card";

export const HomeSkeletonGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-500">
      {Array.from({ length: 8 }).map((_, i) => (
        <ShimmerCard
          key={i}
          className="h-24 w-full border border-black/5 dark:border-white/5"
        />
      ))}
    </div>
  );
};
