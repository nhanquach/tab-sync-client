import React from "react";
import { WebStoriesTwoTone } from "@mui/icons-material";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";
import { cn } from "@/lib/utils";

interface IUrlGridItemProps {
  tab: ITab;
  isSelected?: boolean;
  onSelect?: (tab: ITab) => void;
}

const UrlGridItem: React.FC<IUrlGridItemProps> = ({ tab, isSelected, onSelect }) => {
  const [showFallback, handleOnErrorImage] = useLoadFavIcon();

  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
        e.preventDefault();
        onSelect(tab);
    }
  };

  return (
    <div
        onClick={handleClick}
        className={cn(
            "flex flex-col h-full p-3 rounded-xl border transition-all cursor-pointer shadow-sm relative",
            isSelected
                ? "bg-md-sys-color-secondary-container/20 border-md-sys-color-primary ring-2 ring-md-sys-color-primary/20"
                : "bg-md-sys-color-surface-container-low hover:bg-md-sys-color-surface-container hover:shadow-md border-transparent"
        )}
    >
      <div className="flex items-center gap-2 mb-2">
        {!showFallback ? (
          <img
            src={tab.favIconUrl}
            height={24}
            width={24}
            className="min-w-[24px] rounded-sm bg-white p-0.5"
            alt="favicon"
            onError={handleOnErrorImage}
          />
        ) : (
          <WebStoriesTwoTone className="text-md-sys-color-on-surface-variant" style={{ fontSize: 24 }} />
        )}
        <div className="text-xs text-md-sys-color-outline italic ml-auto">
          {dayjs(tab.timeStamp).format("DD MMM")}
        </div>
      </div>

      <span
        className={cn(
            "font-semibold text-sm line-clamp-2 mb-1",
            isSelected ? "text-md-sys-color-primary" : "text-md-sys-color-on-surface"
        )}
        title={tab.title}
      >
        {tab.title}
      </span>

      <div className="text-xs text-md-sys-color-on-surface-variant truncate mt-auto opacity-70" title={tab.url}>
        {tab.url}
      </div>
    </div>
  );
};

export default UrlGridItem;
