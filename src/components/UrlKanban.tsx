import React from "react";
import {
  ArchiveTwoTone,
  DeleteForeverTwoTone,
  LaptopMacTwoTone,
  PhoneIphoneTwoTone,
  DevicesOtherTwoTone,
  CheckBoxTwoTone,
  CheckBoxOutlineBlankTwoTone,
} from "@mui/icons-material";

import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import UrlListItem from "./UrlListItem";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IUrlKanbanProps {
  view: TABS_VIEWS;
  onClear: (deviceName: string) => void;
  urls: ITab[];
  onSelect?: (tab: ITab) => void;
  selectedId?: number;
  isSelectionMode?: boolean;
  selectedTabIds?: Set<number>;
  onToggleTabSelection?: (id: number) => void;
  onToggleDeviceSelection?: (deviceName: string, select: boolean) => void;
  exitingTabIds?: Set<number>;
}

const UrlKanban: React.FC<IUrlKanbanProps> = ({
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
}) => {
  // Simple helper to avoid dependency issues with lodash types
  const groupBy = <T,>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((result, item) => {
      const groupKey = String(item[key]);
      (result[groupKey] = result[groupKey] || []).push(item);
      return result;
    }, {} as Record<string, T[]>);
  };

  const groupByBrowser = groupBy(urls, "deviceName");
  const browsers = Object.keys(groupByBrowser);

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    const className = "text-md-sys-color-primary mr-2";
    if (
      lower.includes("mac") ||
      lower.includes("windows") ||
      lower.includes("laptop")
    )
      return <LaptopMacTwoTone className={className} />;
    if (
      lower.includes("iphone") ||
      lower.includes("android") ||
      lower.includes("mobile")
    )
      return <PhoneIphoneTwoTone className={className} />;
    return <DevicesOtherTwoTone className={className} />;
  };

  return (
    <div className="flex flex-row overflow-x-auto gap-4 pb-4 h-[calc(100vh-240px)] items-start pt-1 px-1">
      {browsers.map((name) => {
        const tabs: ITab[] = groupByBrowser[name];
        const allSelected = tabs.every((t) => selectedTabIds?.has(t.id));

        return (
          <div
            key={name}
            className="flex-shrink-0 w-[320px] max-h-full flex flex-col bg-md-sys-color-surface-container-low/60 backdrop-blur-md rounded-[24px] border border-md-sys-color-outline-variant/20 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Column Header */}
            <div className="p-4 bg-md-sys-color-surface-container/40 border-b border-md-sys-color-outline-variant/10 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl">
              <div className="flex items-center min-w-0 gap-2">
                {getIcon(name)}
                <div className="flex flex-col min-w-0">
                    <h3 className="text-sm font-bold text-md-sys-color-on-surface truncate max-w-[120px]">
                    {name || "Unknown"}
                    </h3>
                </div>
                <span className="text-[10px] font-bold text-md-sys-color-primary bg-md-sys-color-primary/10 px-2 py-0.5 rounded-full">
                  {tabs.length}
                </span>
              </div>

              {!isSelectionMode ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onClear(name)}
                        className="h-8 w-8 text-md-sys-color-outline hover:text-md-sys-color-error hover:bg-md-sys-color-error-container/20 rounded-full"
                      >
                        {view === TABS_VIEWS.OPEN_TABS && (
                          <ArchiveTwoTone style={{ fontSize: 18 }} />
                        )}
                        {view === TABS_VIEWS.ARCHIVED_TABS && (
                          <DeleteForeverTwoTone style={{ fontSize: 18 }} />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {view === TABS_VIEWS.OPEN_TABS
                          ? "Archive all"
                          : "Delete all"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleDeviceSelection?.(name, !allSelected)}
                  className="h-8 w-8 text-md-sys-color-primary hover:bg-md-sys-color-primary/10 rounded-full"
                >
                  {allSelected ? (
                    <CheckBoxTwoTone style={{ fontSize: 20 }} />
                  ) : (
                    <CheckBoxOutlineBlankTwoTone style={{ fontSize: 20 }} />
                  )}
                </Button>
              )}
            </div>

            {/* Tabs List */}
            <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar flex-1">
              {tabs.map((tab: ITab) => {
                return (
                  <div key={tab.id} className="rounded-xl overflow-hidden bg-md-sys-color-surface/50">
                    <UrlListItem
                        tab={tab}
                        onSelect={() => {
                            if (isSelectionMode) {
                                onToggleTabSelection?.(tab.id);
                            } else {
                                onSelect?.(tab);
                            }
                        }}
                        isSelected={tab.id === selectedId}
                        isSelectionMode={isSelectionMode}
                        isChecked={selectedTabIds?.has(tab.id)}
                        isExiting={exitingTabIds?.has(tab.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UrlKanban;
