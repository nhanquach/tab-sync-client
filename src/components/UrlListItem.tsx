import React from "react";
import { WebStoriesTwoTone } from "@mui/icons-material";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";
import { cn } from "@/lib/utils";

interface IUrlListItem {
  tab: ITab;
  isSelected?: boolean;
  onSelect?: (tab: ITab) => void;
}

const UrlListItem: React.FC<IUrlListItem> = ({ tab, isSelected, onSelect }) => {
  const [showFallback, handleOnErrorImage] = useLoadFavIcon();

  const handleClick = (e: React.MouseEvent) => {
    // If onSelect is provided, prevent default navigation (if any) and select
    if (onSelect) {
        e.preventDefault();
        onSelect(tab);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
      "flex items-center gap-4 p-4 transition-all group relative",
      "hover:bg-md-sys-color-surface-container-high/50 cursor-pointer",
      isSelected && "bg-md-sys-color-secondary-container/30 hover:bg-md-sys-color-secondary-container/40"
    )}>

      {/* Selection Indicator */}
      {isSelected && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-md-sys-color-primary" />
      )}

      <div className="flex-shrink-0">
         {!showFallback ? (
            <img
              src={tab.favIconUrl}
              height={32}
              width={32}
              className="min-w-[32px] h-[32px] rounded-md object-contain bg-white p-0.5 border border-md-sys-color-outline-variant/20"
              alt="favicon"
              onError={handleOnErrorImage}
            />
          ) : (
            <div className="w-8 h-8 rounded-md bg-md-sys-color-surface-container-high flex items-center justify-center">
                <WebStoriesTwoTone className="text-md-sys-color-primary" style={{ fontSize: 20 }} />
            </div>
          )}
      </div>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0 overflow-hidden">
        <div className="flex items-baseline justify-between gap-2">
            <span
            className={cn(
                "font-medium text-base truncate transition-colors",
                isSelected ? "text-md-sys-color-primary" : "text-md-sys-color-on-surface group-hover:text-md-sys-color-primary"
            )}
            >
            {tab.title}
            </span>
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
