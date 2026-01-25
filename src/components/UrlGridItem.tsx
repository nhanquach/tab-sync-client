import React from "react";
import { WebStoriesTwoTone, CheckCircleTwoTone } from "@mui/icons-material";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";
import { cn } from "@/lib/utils";
import { Density } from "../interfaces/Density";
import { DENSITY } from "../utils/constants";

interface IUrlGridItemProps {
  tab: ITab;
  onSelect?: (tab: ITab) => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  isChecked?: boolean;
  isExiting?: boolean;
  density?: Density;
}

const UrlGridItem: React.FC<IUrlGridItemProps> = ({
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
        "flex flex-col h-full rounded-lg border bg-card/50 hover:bg-muted/50 transition-all shadow-sm cursor-pointer relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isCompact ? "p-2" : "p-3",
        isSelected && !isSelectionMode && "ring-2 ring-primary bg-primary/5",
        isChecked && isSelectionMode && "ring-2 ring-primary bg-primary/5",
        isExiting && "animate-out zoom-out-95 fade-out slide-out-to-left-2 duration-300 fill-mode-forwards pointer-events-none"
      )}
      onClick={() => !isExiting && onSelect?.(tab)}
    >
      {isSelected && !isSelectionMode && (
        <div className="absolute top-0 right-0 p-1" aria-hidden="true">
          <CheckCircleTwoTone className="text-primary" style={{ fontSize: 16 }} />
        </div>
      )}

      {isSelectionMode && isChecked && (
        <div className="absolute top-0 right-0 p-1" aria-hidden="true">
          <CheckCircleTwoTone className="text-primary" style={{ fontSize: 20 }} />
        </div>
      )}

      <div className={cn("flex items-center gap-2 min-w-0", isCompact ? "mb-1" : "mb-2")} aria-hidden="true">
        {!showFallback ? (
          <img
            src={tab.favIconUrl}
            height={isCompact ? 20 : 24}
            width={isCompact ? 20 : 24}
            className={cn("rounded-sm", isCompact ? "min-w-[20px]" : "min-w-[24px]")}
            alt=""
            onError={handleOnErrorImage}
          />
        ) : (
          <WebStoriesTwoTone className="text-muted-foreground" style={{ fontSize: isCompact ? 20 : 24 }} />
        )}
        <div className={cn("text-muted-foreground/80 italic ml-auto flex-shrink-0", isCompact ? "text-[10px]" : "text-xs")}>
          {dayjs(tab.timeStamp).format("DD MMM")}
        </div>
      </div>

      <a
        href={tab.url}
        target="_blank"
        rel="noreferrer"
        className={cn(
            "font-semibold text-foreground hover:underline line-clamp-2 min-w-0",
            isCompact ? "text-xs mb-0.5" : "text-sm mb-1"
        )}
        title={tab.title}
      >
        {tab.title}
      </a>

      <div className={cn("text-muted-foreground truncate mt-auto", isCompact ? "text-[10px]" : "text-xs")} title={tab.url}>
        {tab.url}
      </div>
    </div>
  );
};

export default UrlGridItem;
