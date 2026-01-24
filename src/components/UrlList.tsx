import React from "react";
// @ts-expect-error no types for this lib
import groupBy from "lodash.groupby";
import { ArchiveTwoTone, DeleteForeverTwoTone, LaptopMacTwoTone, PhoneIphoneTwoTone, DevicesOtherTwoTone, CheckBoxTwoTone, CheckBoxOutlineBlankTwoTone, PublicTwoTone } from "@mui/icons-material";

import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import UrlListItem from "./UrlListItem";
import { GROUP_BY } from "../utils/constants";
import { getDomain } from "../utils/urlUtils";

// Shadcn UI
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface IUrlListProps {
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
  groupBy?: string;
}

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
  groupBy: groupByMode = GROUP_BY.DEVICE,
}) => {
  const groupedTabs = groupByMode === GROUP_BY.DOMAIN
    ? groupBy(urls, (t: ITab) => getDomain(t.url))
    : groupBy(urls, "deviceName");

  const groups = Object.keys(groupedTabs);

  // Helper to get icon for header
  const getIcon = (name: string, tabs: ITab[]) => {
    const className = "text-md-sys-color-primary mr-2";

    if (groupByMode === GROUP_BY.DOMAIN) {
      if (tabs.length > 0 && tabs[0].favIconUrl) {
         return <img src={tabs[0].favIconUrl} alt="icon" className="w-5 h-5 mr-2 rounded-sm" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
         }}/>
      }
      return <PublicTwoTone className={className} />;
    }

    const lower = name.toLowerCase();
    if (lower.includes("mac") || lower.includes("windows") || lower.includes("laptop"))
      return <LaptopMacTwoTone className={className} />;
    if (lower.includes("iphone") || lower.includes("android") || lower.includes("mobile"))
      return <PhoneIphoneTwoTone className={className} />;
    return <DevicesOtherTwoTone className={className} />;
  };

  return (
    <div className="space-y-8 my-4">
      {groups.map((name) => {
        const tabs: ITab[] = groupedTabs[name];
        const allSelected = tabs.every(t => selectedTabIds?.has(t.id));

        return (
          <div key={name} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             {/* Section Header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center min-w-0 flex-1 mr-2">
                    {getIcon(name, tabs)}
                    <h3 className="text-lg font-medium text-md-sys-color-on-surface truncate min-w-0">
                        {name || (groupByMode === GROUP_BY.DOMAIN ? "Unknown Domain" : "Unknown Device")}
                    </h3>
                    <span className="ml-3 text-xs font-medium text-md-sys-color-on-surface-variant bg-md-sys-color-surface-container-high px-2 py-0.5 rounded-full flex-shrink-0">
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

            {/* Container Card for List Items */}
            <Card className={cn(
                "overflow-hidden border-none shadow-sm",
                "bg-md-sys-color-surface-container-low" // Filled card style
            )}>
              <div className="divide-y divide-md-sys-color-outline-variant/20">
                {tabs.map((tab: ITab) => {
                  return (
                    <UrlListItem 
                      tab={tab} 
                      key={tab.id} 
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
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default UrlList;
