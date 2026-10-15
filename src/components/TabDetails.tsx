import React, { useState } from "react";
import { Archive, Check, Copy, ExternalLink, Share2, Trash2, X } from "lucide-react";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import { Button } from "@/components/ui/button";
import { hostOf } from "../utils/tabMeta";
import DeviceIcon from "./DeviceIcon";
import Favicon from "./Favicon";

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
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(tab.url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
        <h2 className="flex-1 text-sm font-semibold">Tab details</h2>
        <button type="button" onClick={onClose} className="icon-btn" aria-label="Close details">
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-white">
            <Favicon src={tab.favIconUrl} className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="line-clamp-3 text-sm font-medium leading-snug">{tab.title}</p>
            <p className="truncate text-xs text-muted-foreground">{hostOf(tab.url)}</p>
          </div>
        </div>

        <section className="space-y-2">
          <h3 className="section-label">Details</h3>
          <div className="settings-group text-sm">
            <div className="settings-row min-h-[40px]">
              <span className="w-16 shrink-0 text-muted-foreground">Device</span>
              <span className="flex min-w-0 flex-1 items-center gap-1.5">
                <DeviceIcon name={tab.deviceName} />
                <span className="truncate">{tab.deviceName}</span>
              </span>
            </div>
            <div className="settings-row min-h-[40px]">
              <span className="w-16 shrink-0 text-muted-foreground">Synced</span>
              <span className="min-w-0 flex-1 truncate">{dayjs(tab.timeStamp).format("MMM D, YYYY HH:mm")}</span>
            </div>
            <div className="settings-row min-h-[40px] items-start">
              <span className="w-16 shrink-0 pt-0.5 text-muted-foreground">URL</span>
              <span className="min-w-0 flex-1 break-all text-xs leading-5 text-muted-foreground">{tab.url}</span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="icon-btn h-6 w-6"
                aria-label={isCopied ? "Copied" : "Copy URL"}
                title="Copy URL"
              >
                {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <Button asChild className="gap-2">
            <a href={tab.url} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open tab
            </a>
          </Button>
          <Button
            variant="outline"
            className="gap-2"
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
            <Share2 className="h-4 w-4" />
            Share
          </Button>

          {view === TABS_VIEWS.OPEN_TABS ? (
            <Button variant="outline" className="col-span-2 gap-2" onClick={() => onArchive?.(tab)}>
              <Archive className="h-4 w-4" />
              Archive tab
            </Button>
          ) : (
            <Button
              variant="outline"
              className="col-span-2 gap-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
              onClick={() => onDelete?.(tab)}
            >
              <Trash2 className="h-4 w-4" />
              Delete permanently
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabDetails;
