import React from "react";
import { WebStoriesTwoTone, CheckCircle } from "@mui/icons-material";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";
import { cn } from "@/lib/utils";

interface IUrlListItem {
  tab: ITab;
  onSelect?: (tab: ITab) => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  isChecked?: boolean;
  isExiting?: boolean;
}

const UrlListItem: React.FC<IUrlListItem> = ({ tab, onSelect, isSelected, isSelectionMode, isChecked, isExiting }) => {
  const [showFallback, handleOnErrorImage] = useLoadFavIcon();

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
        "flex items-center gap-4 p-4 transition-all group relative",
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
                "w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center",
                isChecked
                  ? "bg-md-sys-color-primary border-md-sys-color-primary"
                  : "border-md-sys-color-outline"
            )}>
               {isChecked && <CheckCircle className="text-white text-[20px]" />}
            </div>
         </div>
      )}

      <div className="flex-shrink-0" aria-hidden="true">
         {!showFallback ? (
            <img
              src={tab.favIconUrl}
              height={32}
              width={32}
              className="min-w-[32px] h-[32px] rounded-md object-contain bg-white p-0.5 border border-md-sys-color-outline-variant/20"
              alt=""
              onError={handleOnErrorImage}
            />
          ) : (
            <div className="w-8 h-8 rounded-md bg-md-sys-color-surface-container-high flex items-center justify-center">
                <WebStoriesTwoTone className="text-md-sys-color-primary" style={{ fontSize: 20 }} />
            </div>
          )}
      </div>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 min-w-0">
            <a
            href={tab.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-base text-md-sys-color-on-surface hover:text-md-sys-color-primary truncate transition-colors flex-1 min-w-0 focus-visible:outline-none focus-visible:underline"
            >
            {tab.title}
            </a>
            <span className="text-xs text-md-sys-color-outline flex-shrink-0 hidden sm:inline-block">
                {dayjs(tab.timeStamp).format("MMM D, HH:mm")}
            </span>
        </div>

        <div className="text-sm text-md-sys-color-on-surface-variant truncate w-full flex items-center gap-2">
           <span className="truncate">{tab.url}</span>
           <span className="text-xs text-md-sys-color-outline sm:hidden">
             • {dayjs(tab.timeStamp).format("MMM D")}
           </span>
        </div>
      </div>
    </div>
  );
};

export default UrlListItem;
