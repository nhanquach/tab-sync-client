import React from "react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import TypewriterLoader from "./TypewriterLoader";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen, className }) => {
  if (fullScreen) {
    return (
      <div className={cn("flex-grow min-h-screen flex flex-col items-center justify-center bg-md-sys-color-surface gap-8 animate-in fade-in duration-500", className)}>
         <div className="relative">
            <Logo className="w-16 h-16 animate-in zoom-in-50 duration-500" />
         </div>
         <TypewriterLoader className="text-xl" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center w-full py-24 animate-in fade-in zoom-in-95 duration-500", className)}>
       <TypewriterLoader phrases={["Getting tabs...", "Syncing...", "Just a moment..."]} />
    </div>
  );
};

export default LoadingSpinner;
