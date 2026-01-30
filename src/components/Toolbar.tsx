import React, { useRef } from "react";
import {
  RefreshTwoTone,
  Grid3x3TwoTone,
  ListAltTwoTone,
  TimelineTwoTone,
  SortByAlphaTwoTone,
  SearchTwoTone,
  LaptopMacTwoTone,
  PhoneIphoneTwoTone,
  DevicesOtherTwoTone,
  AppsTwoTone,
  Check,
  KeyboardArrowDownTwoTone,
} from "@mui/icons-material";

import { Layout } from "../interfaces/Layout";
import { ORDER } from "../utils/constants";
import { useKeyPress } from "../hooks/useKeyPress";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IToolbarProps {
  handleRefresh(): void;
  isLoading: boolean;
  searchString: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSearch: (e: any) => void;
  toggleLayout(): void;
  layout: Layout;
  toggleOrderBy(): void;
  orderBy: ORDER;

  devices: string[];
  selectedDevice: string;
  onSelectDevice: (device: string) => void;
  isScrolled?: boolean;
  isSelectionMode?: boolean;
  toggleSelectionMode?: () => void;
  isMobile?: boolean;
}

const Toolbar: React.FC<IToolbarProps> = ({
  isLoading,
  handleRefresh,
  searchString,
  handleSearch,
  toggleLayout,
  layout,
  toggleOrderBy,
  orderBy,
  devices,
  selectedDevice,
  onSelectDevice,
  isScrolled: isScrolledProp = false,
  isSelectionMode,
  toggleSelectionMode,
  isMobile = false,
}) => {
  const searchBoxRef = useRef<HTMLInputElement>(null);

  const isScrolled = isMobile || isScrolledProp;

  useKeyPress({
    keys: ["/"],
    callback: () => {
      searchBoxRef.current?.focus();
    },
    isCombinedWithCtrl: false,
  });

  const getDeviceIcon = (name: string, isActive: boolean, isCondensed: boolean) => {
    const iconSize = isCondensed ? "text-base mr-1" : "text-lg mr-2";
    const className = cn(
      iconSize,
      "transition-colors duration-300",
      isActive
        ? "text-md-sys-color-on-secondary-container"
        : "text-md-sys-color-on-surface-variant"
    );

    const lower = name.toLowerCase();
    if (lower === "all") return <AppsTwoTone className={className} />;
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

  const tabs = ["All", ...devices];

  return (
    <TooltipProvider>
      <div
        className={cn(
          "sticky z-40 -mx-4 md:-mx-6 px-4 md:px-6 transition-all duration-300 ease-out",
          // Parent styles: transparent on desktop when scrolled (for islands)
          "bg-md-sys-color-surface/80 backdrop-blur-2xl border-b border-md-sys-color-outline-variant/10",
          isScrolled && "md:bg-transparent md:backdrop-blur-none md:border-none md:shadow-none md:pointer-events-none",

          "top-16 md:top-0",
          isScrolled ? "py-2 mb-4 shadow-md" : "py-4 mb-6 shadow-sm bg-md-sys-color-surface/40",
          "w-[calc(100%+32px)] md:w-[calc(100%+48px)]"
        )}
      >
        <div className={cn(
          "flex items-center w-full justify-between gap-3",
          isScrolled ? "h-full" : "flex-wrap md:flex-nowrap"
        )}>

          {/* Left Group (Island 1) */}
          <div className={cn(
            "flex items-center gap-3 flex-none transition-all duration-300",
            // Island styling on desktop when scrolled
            isScrolled && "md:bg-md-sys-color-surface/80 md:backdrop-blur-xl md:shadow-md md:border md:border-md-sys-color-outline-variant/10 md:rounded-full md:px-4 md:py-2 md:pointer-events-auto"
          )}>
            {isScrolled && (
               <span className="text-xl font-normal text-md-sys-color-on-surface tracking-tight animate-in fade-in slide-in-from-left-2 duration-300 hidden md:block">
                  TabSync
               </span>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Refresh tabs"
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className={cn(
                    "rounded-full hover:bg-md-sys-color-surface-container-high transition-all active:scale-90 duration-200",
                    isScrolled ? "h-9 w-9" : "h-12 w-12 bg-md-sys-color-surface-container-low"
                  )}
                >
                  <RefreshTwoTone className={cn(isScrolled ? "text-[20px]" : "text-[24px]", isLoading && "animate-spin")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
          </div>

          {/* Right Group Container */}
          <div className={cn(
            "flex items-center gap-2 justify-end min-w-0 transition-all duration-300",
            // Island styling on desktop when scrolled
            isScrolled && "md:bg-md-sys-color-surface/80 md:backdrop-blur-xl md:shadow-md md:border md:border-md-sys-color-outline-variant/10 md:rounded-full md:px-4 md:py-2 md:pointer-events-auto",
            // Use flex-1 only when not scrolled (or on mobile) to fill space if needed, otherwise let justify-between handle it
            !isScrolled && "flex-1"
          )}>

            {/* Device Dropdown */}
            {((!isMobile) || isScrolled) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-10 px-3 rounded-full hover:bg-md-sys-color-surface-container-high flex items-center gap-1 border border-md-sys-color-outline-variant/20 transition-all duration-200 whitespace-nowrap"
                  >
                    {getDeviceIcon(selectedDevice === "All" ? "all" : selectedDevice, true, true)}
                    <span className="text-[12px] font-semibold max-w-[80px] truncate">{selectedDevice}</span>
                    <KeyboardArrowDownTwoTone className="text-base opacity-40" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-[24px] p-2 bg-md-sys-color-surface-container-high backdrop-blur-xl border-md-sys-color-outline-variant/20 shadow-2xl transition-all duration-200">
                  <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-md-sys-color-on-surface-variant/50 uppercase tracking-widest">Devices</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-md-sys-color-outline-variant/10" />
                  <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                    {tabs.map((device) => (
                      <DropdownMenuItem
                        key={device}
                        onClick={() => onSelectDevice(device)}
                        className={cn(
                          "rounded-[16px] px-3 py-2.5 mb-1 focus:bg-md-sys-color-primary/10 transition-colors duration-150",
                          selectedDevice === device && "bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container"
                        )}
                      >
                        <div className="flex items-center gap-3 w-full">
                          {getDeviceIcon(device === "All" ? "all" : device, selectedDevice === device, false)}
                          <span className="flex-1 font-medium">{device}</span>
                          {selectedDevice === device && <Check className="text-base" />}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Action Buttons */}
            <div className={cn(
              "flex items-center gap-1 bg-md-sys-color-surface-container-low/50 rounded-full p-1 border border-md-sys-color-outline-variant/10 shrink-0",
              !isScrolled && "p-1.5 bg-md-sys-color-surface-container-low"
            )}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label={layout === "grid" ? "Switch to list view" : "Switch to grid view"}
                    variant="ghost"
                    size="icon"
                    onClick={toggleLayout}
                    className={cn("rounded-full transition-all active:scale-90 duration-200", isScrolled ? "h-8 w-8" : "h-9 w-9")}
                  >
                    {layout === "grid" ? <Grid3x3TwoTone className={isScrolled ? "text-[18px]" : "text-[20px]"} /> : <ListAltTwoTone className={isScrolled ? "text-[18px]" : "text-[20px]"} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{layout === "grid" ? "Switch to list view" : "Switch to grid view"}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label={orderBy === ORDER.TIME ? "Sort by name" : "Sort by time"}
                    variant="ghost"
                    size="icon"
                    onClick={toggleOrderBy}
                    className={cn("rounded-full transition-all active:scale-90 duration-200", isScrolled ? "h-8 w-8" : "h-9 w-9")}
                  >
                    {orderBy === ORDER.TIME ? <TimelineTwoTone className={isScrolled ? "text-[18px]" : "text-[20px]"} /> : <SortByAlphaTwoTone className={isScrolled ? "text-[18px]" : "text-[20px]"} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{orderBy === ORDER.TIME ? "Sort by name" : "Sort by time"}</TooltipContent>
              </Tooltip>

              {toggleSelectionMode && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      aria-label={isSelectionMode ? "Exit selection mode" : "Enter selection mode"}
                      variant="ghost"
                      size="icon"
                      onClick={toggleSelectionMode}
                      className={cn(
                        "rounded-full transition-all active:scale-90 duration-200",
                        isScrolled ? "h-8 w-8" : "h-9 w-9",
                        isSelectionMode && "bg-md-sys-color-primary text-md-sys-color-on-primary hover:bg-md-sys-color-primary/90"
                      )}
                    >
                      <Check className={isScrolled ? "text-[18px]" : "text-[20px]"} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isSelectionMode ? "Exit selection mode" : "Enter selection mode"}</TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Search Bar (Static) */}
             <div className={cn(
               "relative z-20 transition-all duration-200",
               isScrolled ? "w-40 md:w-60" : "w-48 md:w-72"
             )}>
                <SearchTwoTone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-md-sys-color-on-surface-variant opacity-50 pointer-events-none" />
                <Input
                  ref={searchBoxRef}
                  value={searchString}
                  onChange={handleSearch}
                  placeholder="Search..."
                  className={cn(
                    "pl-9 pr-4 transition-all duration-200 border-none",
                    isScrolled
                      ? "h-10 rounded-full bg-md-sys-color-surface-container-high/40 placeholder:text-md-sys-color-on-surface-variant/40 text-sm"
                      : "h-10 rounded-full bg-md-sys-color-surface-container-high/60 text-sm shadow-sm focus:shadow-md focus:bg-md-sys-color-surface-container-high"
                  )}
                />
             </div>

          </div>
        </div>

        {/* Mobile Device Chips Row (Hidden on desktop) */}
        <div className={cn(
          "flex items-center gap-2 overflow-x-auto no-scrollbar w-full transition-all duration-300",
          isScrolled
            ? "h-0 opacity-0 pointer-events-none translate-y-[-10px] invisible absolute"
            : "h-auto opacity-100 visible relative mt-4 px-1 md:hidden"
        )}>
          {tabs.map((device) => {
            const isActive = selectedDevice === device;
            return (
              <button
                key={device}
                onClick={() => onSelectDevice(device)}
                className={cn(
                  "relative flex items-center justify-center rounded-[16px] px-5 h-9 transition-all duration-200 whitespace-nowrap select-none border",
                  "text-sm font-medium active:scale-95",
                  isActive
                    ? "bg-md-sys-color-primary text-md-sys-color-on-primary border-transparent shadow-lg scale-105 z-10"
                    : "bg-md-sys-color-surface-container text-md-sys-color-on-surface-variant border-md-sys-color-outline-variant/30 hover:bg-md-sys-color-surface-container-high"
                )}
              >
                {isActive && <Check className="mr-2 h-4 w-4 animate-in zoom-in duration-200" />}
                {!isActive && getDeviceIcon(device === "All" ? "all" : device, false, false)}
                {device}
              </button>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;
