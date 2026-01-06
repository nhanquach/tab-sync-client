import React from "react";
import { WebStoriesTwoTone } from "@mui/icons-material";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";

interface IUrlGridItemProps {
  tab: ITab;
}

const UrlGridItem: React.FC<IUrlGridItemProps> = ({ tab }) => {
  const [showFallback, handleOnErrorImage] = useLoadFavIcon();

  return (
    <div className="flex flex-col h-full p-3 rounded-lg border bg-card/50 hover:bg-muted/50 transition-colors shadow-sm">
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
