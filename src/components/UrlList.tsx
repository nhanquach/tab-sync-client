import React, { useEffect, useMemo, useRef, useState } from "react";
import { Archive, ChevronRight, Trash2 } from "lucide-react";

import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import { cn } from "@/lib/utils";
import { newestTimeStamp, timeAgo } from "../utils/tabMeta";
import UrlListItem from "./UrlListItem";
import DeviceIcon from "./DeviceIcon";

interface IUrlListProps {
  view: TABS_VIEWS;
  onClear: (deviceName: string) => void;
  urls: ITab[];
  onSelect?: (tab: ITab) => void;
  selectedId?: string;
  isSelectionMode?: boolean;
  selectedTabIds?: Set<string>;
  onToggleTabSelection?: (id: string) => void;
  onToggleDeviceSelection?: (deviceName: string, select: boolean) => void;
  exitingTabIds?: Set<string>;
  /** While searching every group is shown expanded. */
  isSearching?: boolean;
}

interface IGroup {
  name: string;
  tabs: ITab[];
  lastSeen?: string;
}

type Row = { type: "device"; group: IGroup } | { type: "tab"; group: IGroup; tab: ITab };

/** Is the keyboard event aimed at something other than the list (another input, an open dialog)? */
const shouldIgnoreKey = (e: KeyboardEvent) => {
  if (e.altKey || e.metaKey || e.ctrlKey) return true;
  if (document.querySelector('[role="dialog"], [role="menu"]')) return true;
  const target = e.target as HTMLElement | null;
  if (!target) return false;
  if (target.hasAttribute("data-search-input")) return false;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable;
};

/**
 * Tabs grouped by device with collapsible headers, like the extension popup.
 * Keyboard: ↑/↓ move, Enter opens the tab (or toggles a device), ←/→ collapse/expand.
 */
const UrlList: React.FC<IUrlListProps> = ({
  onClear,
  urls,
  view,
  onSelect,
  selectedId,
  isSelectionMode,
  selectedTabIds,
  onToggleTabSelection,
  onToggleDeviceSelection,
  exitingTabIds,
  isSearching = false,
}) => {
  const groups = useMemo<IGroup[]>(() => {
    const map = new Map<string, ITab[]>();
    urls.forEach((tab) => {
      const key = tab.deviceName || "Unknown device";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(tab);
    });
    return Array.from(map.entries()).map(([name, tabs]) => ({ name, tabs, lastSeen: newestTimeStamp(tabs) }));
  }, [urls]);

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [active, setActive] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  const isOpen = (name: string) => isSearching || !collapsed.has(name);

  const rows = useMemo<Row[]>(() => {
    const out: Row[] = [];
    groups.forEach((group) => {
      out.push({ type: "device", group });
      if (isSearching || !collapsed.has(group.name)) {
        group.tabs.forEach((tab) => out.push({ type: "tab", group, tab }));
      }
    });
    return out;
  }, [groups, collapsed, isSearching]);

  const toggle = (name: string, open?: boolean) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      const shouldOpen = open ?? next.has(name);
      if (shouldOpen) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  // Searching jumps the highlight to the first matching tab.
  useEffect(() => {
    setActive(isSearching ? rows.findIndex((r) => r.type === "tab") : -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching, urls]);

  useEffect(() => {
    setActive((i) => Math.min(i, rows.length - 1));
  }, [rows.length]);

  useEffect(() => {
    if (active < 0) return;
    listRef.current
      ?.querySelector(`[data-row="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // Keep the latest state for the window listener.
  const stateRef = useRef({ rows, active, isSelectionMode, isSearching });
  stateRef.current = { rows, active, isSelectionMode, isSearching };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (shouldIgnoreKey(e)) return;
      const { rows, active, isSelectionMode, isSearching } = stateRef.current;
      const row = rows[active];
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActive((i) => Math.min(i + 1, rows.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActive((i) => Math.max(i - 1, 0));
          break;
        case "ArrowRight":
          if (row?.type === "device" && !isSearching && !(e.target as HTMLElement).hasAttribute("data-search-input")) {
            toggle(row.group.name, true);
          }
          break;
        case "ArrowLeft":
          if (row && !isSearching && !(e.target as HTMLElement).hasAttribute("data-search-input")) {
            toggle(row.group.name, false);
            setActive(rows.findIndex((r) => r.type === "device" && r.group.name === row.group.name));
          }
          break;
        case "Enter":
          if (!row) break;
          e.preventDefault();
          if (row.type === "device") toggle(row.group.name);
          else if (isSelectionMode) onToggleTabSelection?.(row.tab.uid);
          else window.open(row.tab.url, "_blank", "noopener,noreferrer");
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onToggleTabSelection]);

  return (
    <div ref={listRef} className="-mx-2 pb-2" role="listbox" aria-label="Tabs by device" aria-multiselectable={isSelectionMode}>
      {rows.map((row, i) => {
        if (row.type === "device") {
          const { group } = row;
          const open = isOpen(group.name);
          const allSelected = group.tabs.every((t) => selectedTabIds?.has(t.uid));
          return (
            <div
              key={`device:${group.name}`}
              role="button"
              tabIndex={-1}
              aria-expanded={open}
              data-row={i}
              onMouseMove={() => setActive(i)}
              onClick={() => {
                setActive(i);
                toggle(group.name);
              }}
              className={cn("row group mt-2 cursor-pointer first:mt-0", i === active && "row-active")}
            >
              <ChevronRight
                className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", open && "rotate-90")}
                aria-hidden
              />
              <DeviceIcon name={group.name} />
              <span className="min-w-0 flex-1 truncate text-left text-sm font-medium">{group.name}</span>

              {isSelectionMode ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDeviceSelection?.(group.name, !allSelected);
                  }}
                  className="shrink-0 rounded px-1.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/10"
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
              ) : (
                <>
                  <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{timeAgo(group.lastSeen)}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClear(group.name);
                    }}
                    className="icon-btn h-6 w-6 opacity-100 hover:text-destructive md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100"
                    aria-label={view === TABS_VIEWS.OPEN_TABS ? `Archive all tabs from ${group.name}` : `Delete all archived tabs from ${group.name}`}
                    title={view === TABS_VIEWS.OPEN_TABS ? "Archive all" : "Delete all"}
                  >
                    {view === TABS_VIEWS.OPEN_TABS ? <Archive className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </>
              )}
              <span className="shrink-0 rounded bg-muted px-1.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                {group.tabs.length}
              </span>
            </div>
          );
        }

        const { tab } = row;
        return (
          <UrlListItem
            key={tab.uid}
            tab={tab}
            rowIndex={i}
            isActive={i === active}
            onHover={() => setActive(i)}
            onSelect={() => {
              if (isSelectionMode) {
                onToggleTabSelection?.(tab.uid);
              } else {
                onSelect?.(tab);
              }
            }}
            isSelected={tab.uid === selectedId}
            isSelectionMode={isSelectionMode}
            isChecked={selectedTabIds?.has(tab.uid)}
            isExiting={exitingTabIds?.has(tab.uid)}
          />
        );
      })}
    </div>
  );
};

export default UrlList;
