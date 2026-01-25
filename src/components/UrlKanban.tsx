import React from "react";
// @ts-expect-error no types for this lib
import groupBy from "lodash.groupby";
import { ArchiveTwoTone, DeleteForeverTwoTone, CheckBoxTwoTone, CheckBoxOutlineBlankTwoTone } from "@mui/icons-material";

import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import UrlListItem from "./UrlListItem";
import DeviceIcon from "./DeviceIcon";
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
  exitingTabIds
}) => {
  const groupByBrowser = groupBy(urls, "deviceName");
  const browsers = Object.keys(groupByBrowser);

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 items-start h-full min-h-[calc(100vh-220px)] px-1">
      {browsers.map((name) => {
        const tabs: ITab[] = groupByBrowser[name];
        const allSelected = tabs.every(t => selectedTabIds?.has(t.id));

        return (
          <div
            key={name}
            className="w-[320px] flex-shrink-0 flex flex-col bg-md-sys-color-surface-container-low/50 rounded-[24px] border border-md-sys-color-outline-variant/20 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
             {/* Column Header */}
            <div className="p-3 pb-2 flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1 mr-2 gap-2">
                    <div className="p-2 bg-md-sys-color-surface-container-high rounded-full">
                        <DeviceIcon name={name} className="text-md-sys-color-primary text-xl" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-md-sys-color-on-surface truncate">
                            {name || "Unknown"}
                        </h3>
                        <span className="text-xs text-md-sys-color-on-surface-variant font-medium">
                            {tabs.length} tabs
                        </span>
                    </div>
                </div>

                {!isSelectionMode ? (
                  <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onClear(name)}
                        className="h-8 w-8 text-md-sys-color-outline hover:text-md-sys-color-error hover:bg-md-sys-color-error-container/20 rounded-full"
                      >
                        {view === TABS_VIEWS.OPEN_TABS && <ArchiveTwoTone fontSize="small" />}
                        {view === TABS_VIEWS.ARCHIVED_TABS && <DeleteForeverTwoTone fontSize="small" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{view === TABS_VIEWS.OPEN_TABS ? "Archive all" : "Delete all"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleDeviceSelection?.(name, !allSelected)}
                    className="text-md-sys-color-primary hover:bg-md-sys-color-primary/10 rounded-full px-2"
                  >
                     {allSelected ? (
                       <CheckBoxTwoTone fontSize="small" />
                     ) : (
                       <CheckBoxOutlineBlankTwoTone fontSize="small" />
                     )}
                  </Button>
                )}
            </div>

            {/* List Container */}
            <div className="flex-1 overflow-y-auto min-h-[100px] p-2 space-y-1">
                {tabs.map((tab: ITab) => {
                  return (
                    <div key={tab.id} className="bg-md-sys-color-surface rounded-[16px] shadow-sm border border-md-sys-color-outline-variant/10 overflow-hidden">
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
