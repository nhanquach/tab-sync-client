import React from "react";
// @ts-expect-error no types for this lib
import groupBy from "lodash.groupby";
import { Archive, Trash2 } from "lucide-react";

import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import UrlGridItem from "./UrlGridItem";

import { DeviceChip, DevicePill } from "./DeviceIcon";
import { newestTimeStamp, timeAgo } from "../utils/tabMeta";

interface IUrlGridProps {
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
}

const UrlGrid: React.FC<IUrlGridProps> = ({
  onClear,
  urls,
  view,
  onSelect,
  selectedId,
  isSelectionMode,
  selectedTabIds,
  onToggleTabSelection,
  onToggleDeviceSelection,
  exitingTabIds
}) => {
  const groupByBrowser = groupBy(urls, "deviceName");
  const browsers = Object.keys(groupByBrowser);

  return (
    <div className="space-y-6 pb-2">
      {browsers.map((name) => {
        const tabs: ITab[] = groupByBrowser[name];
        const allSelected = tabs.every(t => selectedTabIds?.has(t.uid));

        return (
          <section key={name}>
            {/* Section Header */}
            <div className="group mb-2 flex h-9 items-center gap-2 px-0">
              <DeviceChip name={name} />
              <h3 className="min-w-0 flex-1 truncate text-sm font-medium">{name || "Unknown device"}</h3>
              {isSelectionMode ? (
                <button
                  type="button"
                  onClick={() => onToggleDeviceSelection?.(name, !allSelected)}
                  className="shrink-0 rounded px-1.5 py-0.5 text-xs font-medium text-primary-ink hover:bg-primary/20"
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
              ) : (
                <>
                  <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(newestTimeStamp(tabs))}</span>
                  <button
                    type="button"
                    onClick={() => onClear(name)}
                    className="icon-btn h-6 w-6 hover:text-destructive md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100"
                    aria-label={view === TABS_VIEWS.OPEN_TABS ? `Archive all tabs from ${name}` : `Delete all archived tabs from ${name}`}
                    title={view === TABS_VIEWS.OPEN_TABS ? "Archive all" : "Delete all"}
                  >
                    {view === TABS_VIEWS.OPEN_TABS ? <Archive className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </>
              )}
              <DevicePill name={name}>{tabs.length}</DevicePill>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {tabs.map((tab: ITab) => {
                  return (
                    <UrlGridItem 
                      key={tab.uid} 
                      tab={tab} 
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
          </section>
        );
      })}
    </div>
  );
};

export default UrlGrid;
