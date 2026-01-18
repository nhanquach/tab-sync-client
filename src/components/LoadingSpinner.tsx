import React from "react";
import { CircularProgress } from "@mui/material";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center justify-center w-full h-full animate-in fade-in zoom-in-95 duration-300", className)}>
       <CircularProgress
         size={40}
         thickness={5}
         className="text-md-sys-color-primary"
         sx={{ color: "var(--md-sys-color-primary)" }}
       />
    </div>
  );
};

export default LoadingSpinner;
