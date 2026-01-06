import React from "react";
import { WebStoriesTwoTone } from "@mui/icons-material";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";

interface IUrlListItem {
  tab: ITab;
}

const UrlListItem: React.FC<IUrlListItem> = ({ tab }) => {
  const [showFallback, handleOnErrorImage] = useLoadFavIcon();

  return (
    <div className="flex items-start gap-4 p-2 hover:bg-muted/50 rounded-lg transition-colors">
      {!showFallback ? (
        <img
          src={tab.favIconUrl}
          height={30}
          width={30}
          className="min-w-[30px] rounded-sm mt-1"
          alt="favicon"
          onError={handleOnErrorImage}
        />
      ) : (
        <WebStoriesTwoTone className="text-muted-foreground mt-1" style={{ fontSize: 30 }} />
      )}

      <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden">
        <a
          href={tab.url}
          target="_blank"
          rel="noreferrer"
          className="font-bold text-foreground hover:underline truncate"
        >
          {tab.title}
        </a>

        <div className="text-sm text-muted-foreground truncate w-full">
          {tab.url}
        </div>

        <div className="text-xs italic text-muted-foreground/80">
          opened on {dayjs(tab.timeStamp).format("DD-MMM-YYYY HH:mm:ss")}
        </div>
      </div>
    </div>
  );
};

export default UrlListItem;
