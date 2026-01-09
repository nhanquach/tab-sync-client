import React from "react";
import { LoopTwoTone } from "@mui/icons-material";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen, className }) => {
  if (fullScreen) {
    return (
      <div className={cn("flex-grow min-h-screen flex flex-col items-center justify-center bg-md-sys-color-surface gap-6 animate-in fade-in duration-500", className)}>
         <Logo className="w-16 h-16 animate-in zoom-in-50 duration-500" />
         <LoopTwoTone className="animate-spin text-md-sys-color-primary" sx={{ fontSize: 40 }} />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center w-full py-24 animate-in fade-in zoom-in-95 duration-500", className)}>
       <LoopTwoTone className="animate-spin text-md-sys-color-primary" sx={{ fontSize: 40 }} />
    </div>
  );
};

export default LoadingSpinner;
