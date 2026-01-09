import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ShimmerCard: React.FC<ShimmerCardProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-black/5 dark:bg-white/5",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/10 before:to-transparent",
        className
      )}
      {...props}
    />
  );
};
