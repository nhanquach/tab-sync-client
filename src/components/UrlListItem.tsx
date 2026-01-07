import React from "react";
import { WebStoriesTwoTone } from "@mui/icons-material";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";
import { cn } from "@/lib/utils";

interface IUrlListItem {
  tab: ITab;
}

const UrlListItem: React.FC<IUrlListItem> = ({ tab }) => {
  const [showFallback, handleOnErrorImage] = useLoadFavIcon();

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 mb-3 transition-all duration-300 group",
      // MD3 Elevated Card Styles
      "bg-md-sys-color-surface-container-low rounded-xl shadow-md hover:shadow-lg",
      "border border-transparent hover:border-md-sys-color-outline-variant/50"
    )}>
      <div className="flex-shrink-0">
         {!showFallback ? (
            <img
              src={tab.favIconUrl}
              height={40}
              width={40}
              className="min-w-[40px] h-[40px] rounded-md object-contain bg-white p-0.5"
              alt="favicon"
              onError={handleOnErrorImage}
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-md-sys-color-surface-container-high flex items-center justify-center">
                <WebStoriesTwoTone className="text-md-sys-color-primary" style={{ fontSize: 24 }} />
            </div>
          )}
      </div>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0 overflow-hidden">
        <a
          href={tab.url}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-lg text-md-sys-color-on-surface hover:text-md-sys-color-primary truncate transition-colors"
        >
          {tab.title}
        </a>

        <div className="text-sm text-md-sys-color-on-surface-variant truncate w-full">
          {tab.url}
        </div>

        <div className="flex items-center gap-2 mt-1">
             <span className="text-xs text-md-sys-color-outline font-medium px-2 py-0.5 rounded-full bg-md-sys-color-surface-container-high">
                 {tab.deviceName}
             </span>
             <span className="text-xs text-md-sys-color-outline">
                • {dayjs(tab.timeStamp).format("MMM D, HH:mm")}
             </span>
        </div>
      </div>
    </div>
  );
};

export default UrlListItem;
