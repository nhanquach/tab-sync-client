import React from "react";
import { LaptopMacTwoTone, PhoneIphoneTwoTone, DevicesOtherTwoTone, CheckBoxTwoTone, CheckBoxOutlineBlankTwoTone, ArchiveTwoTone, DeleteForeverTwoTone } from "@mui/icons-material";
import { groupBy } from "../utils/groupBy";

import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import UrlKanbanItem from "./UrlKanbanItem";

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

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    const className = "text-md-sys-color-primary mr-2";
    if (lower.includes("mac") || lower.includes("windows") || lower.includes("laptop"))
      return <LaptopMacTwoTone className={className} />;
    if (lower.includes("iphone") || lower.includes("android") || lower.includes("mobile"))
      return <PhoneIphoneTwoTone className={className} />;
    return <DevicesOtherTwoTone className={className} />;
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth snap-x snap-mandatory">
      {browsers.map((name) => {
        const tabs: ITab[] = groupByBrowser[name];
        const allSelected = tabs.every(t => selectedTabIds?.has(t.id));

        return (
          <div key={name} className="flex-none w-[320px] snap-center flex flex-col h-[calc(100vh-14rem)] bg-md-sys-color-surface-container-high/30 rounded-2xl border border-md-sys-color-outline-variant/20 overflow-hidden">
             {/* Section Header */}
            <div className="flex items-center justify-between p-3 bg-md-sys-color-surface-container-high/50 border-b border-md-sys-color-outline-variant/10">
                <div className="flex items-center min-w-0">
                    {getIcon(name)}
                    <h3 className="text-base font-medium text-md-sys-color-on-surface truncate max-w-[120px]" title={name}>
                        {name || "Unknown"}
                    </h3>
                    <span className="ml-2 text-[10px] font-bold text-md-sys-color-on-surface-variant bg-md-sys-color-surface-container-highest px-2 py-0.5 rounded-full">
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
                    size="icon"
                    onClick={() => onToggleDeviceSelection?.(name, !allSelected)}
                    className="h-8 w-8 text-md-sys-color-primary hover:bg-md-sys-color-primary/10 rounded-full"
                    title={allSelected ? "Deselect All" : "Select All"}
                  >
                     {allSelected ? (
                        <CheckBoxTwoTone fontSize="small" />
                     ) : (
                        <CheckBoxOutlineBlankTwoTone fontSize="small" />
                     )}
                  </Button>
                )}
            </div>

            {/* Column Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 overscroll-contain">
                {tabs.map((tab: ITab) => {
                  return (
                    <UrlKanbanItem
                      key={tab.id}
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
