import React from "react";
import { Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";

/** 16px favicon with a neutral globe fallback. */
const Favicon: React.FC<{ src?: string | null; className?: string }> = ({ src, className }) => {
  const [showFallback, handleOnErrorImage] = useLoadFavIcon();

  if (!src || showFallback || src.startsWith("chrome://")) {
    return <Globe className={cn("h-4 w-4 shrink-0 text-muted-foreground", className)} aria-hidden />;
  }

  return (
    <img
      src={src}
      alt=""
      width={16}
      height={16}
      className={cn("h-4 w-4 shrink-0 rounded-sm object-contain", className)}
      onError={handleOnErrorImage}
    />
  );
};

export default Favicon;
