import React from "react";
import { Check } from "lucide-react";
import dayjs from "dayjs";

import { ITab } from "../interfaces/iTab";
import { cn } from "@/lib/utils";
import { hostOf } from "../utils/tabMeta";
import Favicon from "./Favicon";

interface IUrlListItem {
  tab: ITab;
  onSelect?: (tab: ITab) => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  isChecked?: boolean;
  isExiting?: boolean;
  /** Keyboard/hover highlight. */
  isActive?: boolean;
  rowIndex?: number;
  onHover?: () => void;
}

/** A dense tab row: favicon, title, hostname. Click shows details; the title opens the tab. */
const UrlListItem: React.FC<IUrlListItem> = ({
  tab,
  onSelect,
  isSelected,
  isSelectionMode,
  isChecked,
  isExiting,
  isActive,
  rowIndex,
  onHover,
}) => {
  const host = hostOf(tab.url);

  return (
    <div
      role={isSelectionMode ? "checkbox" : "option"}
      aria-checked={isSelectionMode ? !!isChecked : undefined}
      aria-selected={isSelectionMode ? undefined : !!isSelected}
      data-row={rowIndex}
      onMouseMove={onHover}
      className={cn(
        "row group cursor-pointer pl-8",
        isActive && "row-active",
        isSelected && !isSelectionMode && "bg-primary/10 hover:bg-primary/10",
        isChecked && isSelectionMode && "bg-primary/10 hover:bg-primary/10",
        isExiting && "pointer-events-none duration-300 animate-out fade-out slide-out-to-left-2 fill-mode-forwards"
      )}
      onClick={() => !isExiting && onSelect?.(tab)}
      title={`${tab.title}\n${tab.url}\n${tab.deviceName} · ${dayjs(tab.timeStamp).format("MMM D, HH:mm")}`}
    >
      {isSelectionMode && (
        <span
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
            isChecked ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"
          )}
          aria-hidden
        >
          {isChecked && <Check className="h-3 w-3" strokeWidth={3} />}
        </span>
      )}

      <Favicon src={tab.favIconUrl} />

      <a
        href={tab.url}
        target="_blank"
        rel="noreferrer"
        tabIndex={-1}
        onClick={(e) => {
          if (isSelectionMode) {
            e.preventDefault();
            return;
          }
          e.stopPropagation();
        }}
        className="min-w-0 truncate text-left text-sm text-foreground underline-offset-2 hover:underline"
      >
        {tab.title || host}
      </a>
      <span className="min-w-[16px] flex-1" aria-hidden />

      <span className="max-w-[35%] shrink-0 truncate text-xs text-muted-foreground">{host}</span>
    </div>
  );
};

export default UrlListItem;
