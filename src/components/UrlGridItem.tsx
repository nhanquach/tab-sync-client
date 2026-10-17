import React from "react";
import { Check } from "lucide-react";

import { ITab } from "../interfaces/iTab";
import { cn } from "@/lib/utils";
import { hostOf, timeAgo } from "../utils/tabMeta";
import Favicon from "./Favicon";

interface IUrlGridItemProps {
  tab: ITab;
  onSelect?: (tab: ITab) => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  isChecked?: boolean;
  isExiting?: boolean;
}

const UrlGridItem: React.FC<IUrlGridItemProps> = ({ tab, onSelect, isSelected, isSelectionMode, isChecked, isExiting }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isExiting) onSelect?.(tab);
    }
  };

  return (
    <div
      role={isSelectionMode ? "checkbox" : "button"}
      aria-checked={isSelectionMode ? !!isChecked : undefined}
      tabIndex={isExiting ? -1 : 0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex h-full cursor-pointer flex-col gap-1.5 glass rounded-xl p-3 transition-colors hover:bg-accent/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected && !isSelectionMode && "border-primary-ink/50 bg-primary/20",
        isChecked && isSelectionMode && "border-primary-ink/50 bg-primary/20",
        isExiting && "pointer-events-none duration-300 animate-out fade-out zoom-out-95 fill-mode-forwards"
      )}
      onClick={() => !isExiting && onSelect?.(tab)}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Favicon src={tab.favIconUrl} />
        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{hostOf(tab.url)}</span>
        {isSelectionMode ? (
          <span
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
              isChecked ? "border-primary bg-primary text-primary-foreground" : "border-input"
            )}
            aria-hidden
          >
            {isChecked && <Check className="h-3 w-3" strokeWidth={3} />}
          </span>
        ) : (
          <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(tab.timeStamp)}</span>
        )}
      </div>

      <a
        href={tab.url}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => {
          if (isSelectionMode) {
            e.preventDefault();
            return;
          }
          e.stopPropagation();
        }}
        className="line-clamp-2 min-w-0 text-sm font-medium leading-snug text-foreground underline-offset-2 hover:underline"
        title={tab.title}
      >
        {tab.title}
      </a>
    </div>
  );
};

export default UrlGridItem;
