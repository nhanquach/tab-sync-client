import React from "react";
import { WebStoriesTwoTone, CheckCircleTwoTone } from "@mui/icons-material";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";
import { cn } from "@/lib/utils";

interface IUrlKanbanItemProps {
  tab: ITab;
  onSelect?: (tab: ITab) => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  isChecked?: boolean;
  isExiting?: boolean;
}

const UrlKanbanItem: React.FC<IUrlKanbanItemProps> = ({ tab, onSelect, isSelected, isSelectionMode, isChecked, isExiting }) => {
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
        "flex flex-col p-3 rounded-lg border border-md-sys-color-outline-variant/20 bg-md-sys-color-surface-container-lowest hover:bg-md-sys-color-surface-container-low transition-all shadow-sm cursor-pointer relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
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

      <div className="flex items-center gap-2 mb-2 min-w-0" aria-hidden="true">
        {!showFallback ? (
          <img
            src={tab.favIconUrl}
            height={20}
            width={20}
            className="min-w-[20px] h-[20px] rounded-sm object-contain bg-white p-[1px]"
            alt=""
            onError={handleOnErrorImage}
          />
        ) : (
          <WebStoriesTwoTone className="text-md-sys-color-outline" style={{ fontSize: 20 }} />
        )}
        <div className="text-[10px] text-md-sys-color-outline italic ml-auto flex-shrink-0">
          {dayjs(tab.timeStamp).format("DD MMM")}
        </div>
      </div>

      <a
        href={tab.url}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="font-medium text-sm text-md-sys-color-on-surface hover:text-md-sys-color-primary line-clamp-2 mb-1 min-w-0 focus-visible:outline-none focus-visible:underline"
        title={tab.title}
      >
        {tab.title}
      </a>

      <div className="text-[10px] text-md-sys-color-outline truncate mt-auto" title={tab.url}>
        {tab.url}
      </div>
    </div>
  );
};

export default UrlKanbanItem;
