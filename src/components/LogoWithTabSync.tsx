import React from "react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

/** Loop mark + wordmark. */
const LogoWithTabSync: React.FC<{ className?: string; markClassName?: string }> = ({ className, markClassName }) => {
  return (
    <div className={cn("flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-foreground", className)}>
      <Logo className={cn("h-7 w-7 rounded-[9px]", markClassName)} />
      <span>TabSync</span>
    </div>
  );
};

export default LogoWithTabSync;
