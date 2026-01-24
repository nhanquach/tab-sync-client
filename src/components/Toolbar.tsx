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
  PublicTwoTone,
  CategoryTwoTone,
} from "@mui/icons-material";

import { Layout } from "../interfaces/Layout";
import { ORDER, GROUP_BY } from "../utils/constants";
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

  toggleGroupBy?: () => void;
  groupBy?: string;

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
  toggleGroupBy,
  groupBy,
  devices,
  selectedDevice,
  onSelectDevice,
  isScrolled: isScrolledProp = false,
  isSelectionMode,
  toggleSelectionMode,
  isMobile = false,
}) => {
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);

  const isScrolled = isMobile || isScrolledProp;
  const isMobileSearchExpanded = isMobile && isSearchExpanded;

  React.useEffect(() => {
    if (!isScrolled) setIsSearchExpanded(false);
  }, [isScrolled]);

  useKeyPress({
    keys: ["/"],
    callback: () => {
      if (isScrolled) setIsSearchExpanded(true);
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
          "bg-md-sys-color-surface/80 backdrop-blur-2xl border-b border-md-sys-color-outline-variant/10",
          "top-16 md:top-0",
          isScrolled ? "py-2 h-14 mb-4 shadow-md" : "py-4 mb-6 shadow-sm bg-md-sys-color-surface/40",
          "w-[calc(100%+32px)] md:w-[calc(100%+48px)]"
        )}
      >
        <div className={cn(
          "flex items-center w-full transition-all duration-300 gap-3",
          isScrolled ? "h-full justify-between" : "flex-wrap md:flex-nowrap"
        )}>
          <div className={cn("flex-none", isMobileSearchExpanded && "hidden")}>
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
                    isScrolled ? "h-10 w-10" : "h-12 w-12 bg-md-sys-color-surface-container-low"
                  )}
                >
                  <RefreshTwoTone className={cn(isScrolled ? "text-[20px]" : "text-[24px]", isLoading && "animate-spin")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
          </div>

          <div className={cn(
            "transition-all duration-300 min-w-0 flex items-center gap-2",
            isScrolled ? "flex-1 justify-end" : "flex-1 order-2 md:order-none w-full md:w-auto",
            isMobileSearchExpanded && "w-full justify-center"
          )}>
            {isScrolled && !isSearchExpanded ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label="Search tabs"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchExpanded(true)}
                    className="h-10 w-10 rounded-full hover:bg-md-sys-color-surface-container-high transition-all duration-200"
                  >
                    <SearchTwoTone className="text-md-sys-color-on-surface-variant" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search tabs</TooltipContent>
              </Tooltip>
            ) : (
            <div className={cn(
              "relative transition-all duration-300 group focus-within:scale-[1.01] z-20",
              isScrolled ? "w-40 md:w-80 shrink-0" : "flex-1 max-w-2xl mx-auto",
              isMobileSearchExpanded && "w-full"
            )}>
              <SearchTwoTone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-md-sys-color-on-surface-variant pointer-events-none opacity-50" />
              <Input
                ref={searchBoxRef}
                autoFocus={isScrolled && isSearchExpanded}
                onBlur={() => isScrolled && !searchString && setIsSearchExpanded(false)}
                value={searchString}
                onChange={handleSearch}
                placeholder={isScrolled ? "Search (/)..." : "Search your synced tabs (Press /)..."}
                className={cn(
                  "pl-12 pr-4 transition-all duration-200 border-none",
                  isScrolled 
                    ? "h-10 rounded-full bg-md-sys-color-surface-container-high/40 placeholder:text-md-sys-color-on-surface-variant/40" 
                    : "h-12 rounded-[20px] bg-md-sys-color-surface-container-high/60 text-base shadow-inner focus:shadow-lg focus:bg-md-sys-color-surface-container-high"
                )}
              />
            </div>
          )}

          {isScrolled && !isMobileSearchExpanded && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 px-3 rounded-full hover:bg-md-sys-color-surface-container-high flex items-center gap-1 border border-md-sys-color-outline-variant/20 transition-all duration-200"
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
        </div>

        <div className={cn(
          "flex items-center gap-1 transition-all duration-300",
          isScrolled ? "flex-none" : "flex-none order-1 md:order-none ml-auto",
          isMobileSearchExpanded && "hidden"
        )}>
          <div className={cn(
            "flex items-center gap-1 bg-md-sys-color-surface-container-low/50 rounded-full p-1 border border-md-sys-color-outline-variant/10 shrink-0 transition-all duration-200",
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

            {toggleGroupBy && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label={groupBy === GROUP_BY.DEVICE ? "Group by domain" : "Group by device"}
                    variant="ghost"
                    size="icon"
                    onClick={toggleGroupBy}
                    className={cn("rounded-full transition-all active:scale-90 duration-200", isScrolled ? "h-8 w-8" : "h-9 w-9")}
                  >
                    {groupBy === GROUP_BY.DEVICE ? (
                      <CategoryTwoTone className={isScrolled ? "text-[18px]" : "text-[20px]"} />
                    ) : (
                      <PublicTwoTone className={isScrolled ? "text-[18px]" : "text-[20px]"} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {groupBy === GROUP_BY.DEVICE ? "Group by domain" : "Group by device"}
                </TooltipContent>
              </Tooltip>
            )}

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
        </div>
      </div>

      <div className={cn(
        "flex items-center gap-2 overflow-x-auto no-scrollbar w-full transition-all duration-300",
        isScrolled 
          ? "h-0 opacity-0 pointer-events-none translate-y-[-10px] invisible absolute" 
          : "h-auto opacity-100 visible relative mt-6 px-1"
      )}>
        {tabs.map((device) => {
          const isActive = selectedDevice === device;
          return (
            <button
              key={device}
              onClick={() => onSelectDevice(device)}
              className={cn(
                "relative flex items-center justify-center rounded-[16px] px-5 h-10 transition-all duration-200 whitespace-nowrap select-none border",
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
