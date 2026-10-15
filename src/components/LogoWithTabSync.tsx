import React from "react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

/** Small logo mark + wordmark. */
const LogoWithTabSync: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-2 text-sm font-semibold text-foreground", className)}>
      <Logo className="h-5 w-5 p-0.5" />
      <span>TabSync</span>
    </div>
  );
};

export default LogoWithTabSync;
