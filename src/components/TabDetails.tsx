import React, { useState } from "react";
import {
  CloseTwoTone,
  ContentCopyTwoTone,
  OpenInNewTwoTone,
  ArchiveTwoTone,
  DeleteForeverTwoTone,
  ShareTwoTone,
  CheckCircleTwoTone,
  WebStoriesTwoTone,
  LaptopMacTwoTone,
  PhoneIphoneTwoTone,
  DevicesOtherTwoTone,
} from "@mui/icons-material";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";

interface ITabDetailsProps {
  tab: ITab;
  view: TABS_VIEWS;
  onClose: () => void;
  onArchive?: (tab: ITab) => void;
  onDelete?: (tab: ITab) => void;
}

const TabDetails: React.FC<ITabDetailsProps> = ({
  tab,
  view,
  onClose,
  onArchive,
  onDelete,
}) => {
  const [showFallback, handleOnErrorImage] = useLoadFavIcon();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(tab.url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getDeviceIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("mac") || lower.includes("windows") || lower.includes("laptop"))
      return <LaptopMacTwoTone fontSize="small" />;
    if (lower.includes("iphone") || lower.includes("android") || lower.includes("mobile"))
      return <PhoneIphoneTwoTone fontSize="small" />;
    return <DevicesOtherTwoTone fontSize="small" />;
  };

  return (
    <div className="h-full bg-transparent flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-md-sys-color-outline-variant/20 pt-2 md:pt-6">
        <CardTitle className="text-xl font-medium text-md-sys-color-on-surface">
          Tab Details
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-md-sys-color-surface-container-high"
        >
          <CloseTwoTone />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 no-scrollbar">
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 sm:p-3 shadow-md border border-md-sys-color-outline-variant/20 flex items-center justify-center">
            {!showFallback ? (
              <img
                src={tab.favIconUrl}
                alt="favicon"
                className="w-full h-full object-contain"
                onError={handleOnErrorImage}
              />
            ) : (
              <WebStoriesTwoTone className="text-md-sys-color-primary" style={{ fontSize: 32 }} />
            )}
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold text-md-sys-color-on-surface leading-tight px-2 line-clamp-3">
              {tab.title}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm text-md-sys-color-on-surface-variant">
              <div className="flex items-center gap-1">
                {getDeviceIcon(tab.deviceName)}
                <span>{tab.deviceName}</span>
              </div>
              <span className="hidden xs:inline">•</span>
              <span>{dayjs(tab.timeStamp).format("MMM D, YYYY HH:mm")}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-md-sys-color-outline ml-1">
            URL
          </label>
          <div className="group relative">
            <div className="w-full p-3 sm:p-4 rounded-xl bg-md-sys-color-surface-container-high border border-md-sys-color-outline-variant/20 text-xs sm:text-sm break-all text-md-sys-color-on-surface-variant pr-10 sm:pr-12">
              {tab.url}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyUrl}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 rounded-lg hover:bg-md-sys-color-primary/10 text-md-sys-color-primary h-8 w-8"
            >
              {isCopied ? (
                <CheckCircleTwoTone fontSize="small" />
              ) : (
                <ContentCopyTwoTone fontSize="small" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
          <Button
            asChild
            className="w-full bg-md-sys-color-primary text-md-sys-color-on-primary hover:bg-md-sys-color-primary/90 h-10 sm:h-12 rounded-xl shadow-sm text-sm"
          >
            <a href={tab.url} target="_blank" rel="noreferrer">
              <OpenInNewTwoTone className="mr-2" style={{ fontSize: 18 }} />
              Open Tab
            </a>
          </Button>

          <Button
            variant="outline"
            className="w-full border-md-sys-color-outline-variant/50 text-md-sys-color-on-surface h-10 sm:h-12 rounded-xl hover:bg-md-sys-color-surface-container-high text-sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: tab.title,
                  url: tab.url,
                });
              } else {
                handleCopyUrl();
              }
            }}
          >
            <ShareTwoTone className="mr-2" style={{ fontSize: 18 }} />
            Share
          </Button>

          {view === TABS_VIEWS.OPEN_TABS ? (
            <Button
              variant="outline"
              className="w-full xs:col-span-2 border-md-sys-color-outline-variant/50 text-md-sys-color-on-surface h-10 sm:h-12 rounded-xl hover:bg-md-sys-color-surface-container-high text-sm"
              onClick={() => onArchive?.(tab)}
            >
              <ArchiveTwoTone className="mr-2" style={{ fontSize: 18 }} />
              Archive Tab
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full xs:col-span-2 border-md-sys-color-error/20 text-md-sys-color-error h-10 sm:h-12 rounded-xl hover:bg-md-sys-color-error/10 hover:border-md-sys-color-error/40 text-sm"
              onClick={() => onDelete?.(tab)}
            >
              <DeleteForeverTwoTone className="mr-2" style={{ fontSize: 18 }} />
              Delete Permanently
            </Button>
          )}
        </div>
      </CardContent>
    </div>
  );
};

export default TabDetails;
