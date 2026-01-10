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
}

const UrlGridItem: React.FC<IUrlGridItemProps> = ({ tab, onSelect, isSelected }) => {
  const [showFallback, handleOnErrorImage] = useLoadFavIcon();

  return (
    <div 
      className={cn(
        "flex flex-col h-full p-3 rounded-lg border bg-card/50 hover:bg-muted/50 transition-all shadow-sm cursor-pointer relative overflow-hidden",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
      onClick={() => onSelect?.(tab)}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 p-1">
          <CheckCircleTwoTone className="text-primary" style={{ fontSize: 16 }} />
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
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
        <div className="text-xs text-muted-foreground/80 italic ml-auto">
          {dayjs(tab.timeStamp).format("DD MMM")}
        </div>
      </div>

      <a
        href={tab.url}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-sm text-foreground hover:underline line-clamp-2 mb-1"
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
