import React from "react";
import { WebStoriesTwoTone, CheckCircleTwoTone } from "@mui/icons-material";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";
import { cn } from "@/lib/utils";

interface IUrlGridItemProps {
  tab: ITab;
  onSelect?: (tab: ITab) => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  isChecked?: boolean;
  isExiting?: boolean;
}

const UrlGridItem: React.FC<IUrlGridItemProps> = ({ tab, onSelect, isSelected, isSelectionMode, isChecked, isExiting }) => {
  const [showFallback, handleOnErrorImage] = useLoadFavIcon();

  return (
    <div 
      className={cn(
        "flex flex-col h-full p-4 rounded-3xl border border-border/50 bg-card/85 backdrop-blur-md hover:bg-card/95 hover:shadow-md transition-all shadow-sm cursor-pointer relative overflow-hidden",
        isSelected && !isSelectionMode && "ring-2 ring-primary bg-primary/5",
        isChecked && isSelectionMode && "ring-2 ring-primary bg-primary/5",
        isExiting && "animate-out zoom-out-95 fade-out slide-out-to-left-2 duration-300 fill-mode-forwards pointer-events-none"
      )}
      onClick={() => !isExiting && onSelect?.(tab)}
    >
      {isSelected && !isSelectionMode && (
        <div className="absolute top-0 right-0 p-1">
          <CheckCircleTwoTone className="text-primary" style={{ fontSize: 16 }} />
        </div>
      )}

      {isSelectionMode && isChecked && (
        <div className="absolute top-0 right-0 p-1">
          <CheckCircleTwoTone className="text-primary" style={{ fontSize: 20 }} />
        </div>
      )}

      <div className="flex items-center gap-2 mb-2 min-w-0">
        {!showFallback ? (
          <img
            src={tab.favIconUrl}
            height={24}
            width={24}
            className="min-w-[24px] rounded-sm"
            alt="favicon"
            onError={handleOnErrorImage}
          />
        ) : (
          <WebStoriesTwoTone className="text-muted-foreground" style={{ fontSize: 24 }} />
        )}
        <div className="text-xs text-muted-foreground/80 italic ml-auto flex-shrink-0">
          {dayjs(tab.timeStamp).format("DD MMM")}
        </div>
      </div>

      <a
        href={tab.url}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-sm text-foreground hover:underline line-clamp-2 mb-1 min-w-0"
        title={tab.title}
      >
        {tab.title}
      </a>

      <div className="text-xs text-muted-foreground truncate mt-auto" title={tab.url}>
        {tab.url}
      </div>
    </div>
  );
};

export default UrlGridItem;
