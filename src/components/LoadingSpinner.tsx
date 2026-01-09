import React from "react";
import { LoopTwoTone } from "@mui/icons-material";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center justify-center w-full h-full animate-in fade-in zoom-in-95 duration-300", className)}>
       <LoopTwoTone className="animate-spin text-md-sys-color-primary" sx={{ fontSize: 40 }} />
    </div>
  );
};

export default LoadingSpinner;
