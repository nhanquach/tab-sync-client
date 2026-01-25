import React from "react";
import { WebStoriesTwoTone, CheckCircle } from "@mui/icons-material";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";
import { cn } from "@/lib/utils";
import { DENSITY } from "../utils/constants";
import { Density } from "../interfaces/Density";

interface IUrlListItem {
  tab: ITab;
  onSelect?: (tab: ITab) => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  isChecked?: boolean;
  isExiting?: boolean;
  density?: Density;
}

const UrlListItem: React.FC<IUrlListItem> = ({
  tab,
  onSelect,
  isSelected,
  isSelectionMode,
  isChecked,
  isExiting,
  density = DENSITY.COMFORTABLE
}) => {
  const [showFallback, handleOnErrorImage] = useLoadFavIcon();
  const isCompact = density === DENSITY.COMPACT;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isExiting) onSelect?.(tab);
    }
  };

  return (
    <div
      role={isSelectionMode ? "checkbox" : "button"}
      aria-checked={isSelectionMode ? isChecked : undefined}
      tabIndex={isExiting ? -1 : 0}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex items-center transition-all group relative",
        isCompact ? "gap-3 p-2" : "gap-4 p-4",
        "hover:bg-md-sys-color-surface-container-high/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-sys-color-primary focus-visible:ring-inset",
        isSelected && !isSelectionMode && "bg-md-sys-color-primary/10 hover:bg-md-sys-color-primary/15",
        isChecked && isSelectionMode && "bg-md-sys-color-surface-container-highest",
        isExiting && "animate-out zoom-out-95 fade-out slide-out-to-left-2 duration-300 fill-mode-forwards pointer-events-none"
      )}
      onClick={() => !isExiting && onSelect?.(tab)}
    >
      {isSelected && !isSelectionMode && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-md-sys-color-primary rounded-r-full" />
      )}

      {isSelectionMode && (
         <div className="flex-shrink-0" aria-hidden="true">
            <div className={cn(
                "rounded-full border-2 transition-colors flex items-center justify-center",
                isCompact ? "w-4 h-4" : "w-5 h-5",
                isChecked
                  ? "bg-md-sys-color-primary border-md-sys-color-primary"
                  : "border-md-sys-color-outline"
            )}>
               {isChecked && <CheckCircle className={cn("text-white", isCompact ? "text-[16px]" : "text-[20px]")} />}
            </div>
         </div>
      )}

      <div className="flex-shrink-0" aria-hidden="true">
         {!showFallback ? (
            <img
              src={tab.favIconUrl}
              height={isCompact ? 24 : 32}
              width={isCompact ? 24 : 32}
              className={cn(
                "rounded-md object-contain bg-white p-0.5 border border-md-sys-color-outline-variant/20",
                isCompact ? "min-w-[24px] h-[24px]" : "min-w-[32px] h-[32px]"
              )}
              alt=""
              onError={handleOnErrorImage}
            />
          ) : (
            <div className={cn(
                "rounded-md bg-md-sys-color-surface-container-high flex items-center justify-center",
                isCompact ? "w-6 h-6" : "w-8 h-8"
            )}>
                <WebStoriesTwoTone className="text-md-sys-color-primary" style={{ fontSize: isCompact ? 16 : 20 }} />
            </div>
          )}
      </div>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
            <a
            href={tab.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={cn(
                "font-medium text-md-sys-color-on-surface hover:text-md-sys-color-primary truncate transition-colors flex-1 min-w-0 focus-visible:outline-none focus-visible:underline",
                isCompact ? "text-sm" : "text-base"
            )}
            >
            {tab.title}
            </a>
            <span className={cn(
                "text-md-sys-color-outline flex-shrink-0 hidden sm:inline-block",
                isCompact ? "text-[10px]" : "text-xs"
            )}>
                {dayjs(tab.timeStamp).format("MMM D, HH:mm")}
            </span>
        </div>

        <div className="text-sm text-md-sys-color-on-surface-variant w-full flex items-center gap-2 min-w-0">
           <span className={cn("truncate flex-1 min-w-0", isCompact && "text-xs")}>{tab.url}</span>
           <span className="text-xs text-md-sys-color-outline flex-shrink-0 sm:hidden">
             • {dayjs(tab.timeStamp).format("MMM D")}
           </span>
        </div>
      </div>
    </div>
  );
};

export default UrlListItem;
