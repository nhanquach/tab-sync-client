import React from "react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-full h-full animate-in fade-in zoom-in-95 duration-300",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Spinning Ring */}
        <div className="h-20 w-20 animate-spin rounded-full border-[6px] border-md-sys-color-surface-container-high border-t-md-sys-color-primary ease-linear" />

        {/* Centered Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
             <Logo className="h-10 w-10 animate-pulse shadow-sm" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
