import React from "react";
// @ts-expect-error no types for this lib
import groupBy from "lodash.groupby";
import { ArchiveTwoTone, DeleteForeverTwoTone, LaptopMacTwoTone, PhoneIphoneTwoTone, DevicesOtherTwoTone, CheckBoxTwoTone, CheckBoxOutlineBlankTwoTone } from "@mui/icons-material";

import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import UrlGridItem from "./UrlGridItem";

// Shadcn UI
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IUrlGridProps {
  view: TABS_VIEWS;
  onClear: (deviceName: string) => void;
  urls: ITab[];
  onSelect?: (tab: ITab) => void;
  selectedId?: number;
  isSelectionMode?: boolean;
  selectedTabIds?: Set<number>;
  onToggleTabSelection?: (id: number) => void;
  onToggleDeviceSelection?: (deviceName: string, select: boolean) => void;
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
  onToggleDeviceSelection
}) => {
  const groupByBrowser = groupBy(urls, "deviceName");
  const browsers = Object.keys(groupByBrowser);

   // Helper to get icon for header (Duplicated from UrlList, could be extracted to util but fine here for now)
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
    <div className="space-y-8 my-4">
      {browsers.map((name) => {
        const tabs: ITab[] = groupByBrowser[name];
        const allSelected = tabs.every(t => selectedTabIds?.has(t.id));

        return (
          <div key={name} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             {/* Section Header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center">
                    {getIcon(name)}
                    <h3 className="text-lg font-medium text-md-sys-color-on-surface">
                        {name || "Unknown Device"}
                    </h3>
                    <span className="ml-3 text-xs font-medium text-md-sys-color-on-surface-variant bg-md-sys-color-surface-container-high px-2 py-0.5 rounded-full">
                        {tabs.length} tabs
                    </span>
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
                    className="text-md-sys-color-primary hover:bg-md-sys-color-primary/10 rounded-full px-3"
                  >
                     {allSelected ? (
                       <>
                        <CheckBoxTwoTone fontSize="small" className="mr-2" /> Deselect All
                       </>
                     ) : (
                       <>
                        <CheckBoxOutlineBlankTwoTone fontSize="small" className="mr-2" /> Select All
                       </>
                     )}
                  </Button>
                )}
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tabs.map((tab: ITab) => {
                  return (
                    <UrlGridItem 
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

export default UrlGrid;
