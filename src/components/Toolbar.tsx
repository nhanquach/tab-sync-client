import React, { useRef } from "react";
import {
  RefreshTwoTone,
  DevicesTwoTone,
  CheckTwoTone,
  Grid3x3TwoTone,
  ListAltTwoTone,
  TimelineTwoTone,
  SortByAlphaTwoTone,
  WebTwoTone,
  SearchTwoTone,
} from "@mui/icons-material";

import { Layout } from "../interfaces/Layout";
import { saveItem } from "../utils/LocalStorageHelper";
import { LAST_SAVED_DISPLAYED_BROWSERS_KEY, ORDER } from "../utils/constants";
import { useKeyPress } from "../hooks/useKeyPress";
import { isMobileDevice } from "../utils/isMobile";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
  browsers: string[];
  displayedBrowsers: string[];
  setDisplayedBrowsers: (browsers: string[]) => void;
  toggleLayout(): void;
  layout: Layout;
  toggleOrderBy(): void;
  orderBy: ORDER;
  showThisWebsite: boolean;
  setShowThisWebsite(shouldShow: boolean): void;
}

const Toolbar: React.FC<IToolbarProps> = ({
  isLoading,
  handleRefresh,
  searchString,
  handleSearch,
  browsers,
  displayedBrowsers,
  setDisplayedBrowsers,
  toggleLayout,
  layout,
  toggleOrderBy,
  orderBy,
  showThisWebsite,
  setShowThisWebsite,
}) => {
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const isMobileBrowser = isMobileDevice(navigator);

  useKeyPress({
    keys: ["k"],
    callback: () => {
      searchBoxRef.current?.focus();
    },
    isCombinedWithCtrl: true,
  });

  const handleSelectDisplayBrowsers = (browser: string) => {
    // Prevent closing the dropdown when selecting items by not handling it here
    // The default behavior of DropdownMenuItem is to close, so we might need `onSelect={(e) => e.preventDefault()}`

    const newBrowsers = displayedBrowsers.includes(browser)
      ? displayedBrowsers.filter((f) => f !== browser)
      : [...displayedBrowsers, browser];

    setDisplayedBrowsers(newBrowsers);
    saveItem(LAST_SAVED_DISPLAYED_BROWSERS_KEY, newBrowsers.join(","));
  };

  const handleSetShowThisWebsite = () => {
    setShowThisWebsite(!showThisWebsite);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 md:items-center w-full mt-2">
      {/* Mobile: Search first, then actions row */}
      {/* Desktop: Refresh -> Search -> Actions */}

      {/* Refresh Button - Hidden on mobile, shown on desktop as first item */}
      <div className="hidden md:block">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-10 w-10 shrink-0"
              >
                {isLoading ? (
                   <RefreshTwoTone className="animate-spin" />
                ) : (
                  <RefreshTwoTone />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Search Input */}
      <div className="relative flex-1">
        <SearchTwoTone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={searchBoxRef}
          value={searchString}
          onChange={handleSearch}
          placeholder="Find your tabs..."
          className="pl-9 pr-12 bg-background/50 backdrop-blur-sm"
        />
        {!isMobileBrowser && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        )}
      </div>

      {/* Actions Row - On mobile: Refresh + Filter + Layout + Sort. On Desktop: Filter + Layout + Sort */}
      <div className="flex items-center justify-between md:justify-start gap-1">
        {/* Mobile Refresh Button */}
        <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-10 w-10"
            >
              {isLoading ? (
                 <RefreshTwoTone className="animate-spin" />
              ) : (
                <RefreshTwoTone />
              )}
            </Button>
        </div>

        {/* Device Filter */}
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <DevicesTwoTone />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Device Filters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Available devices</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {browsers.map((browser) => (
              <DropdownMenuItem
                key={browser}
                onSelect={(e) => {
                    e.preventDefault();
                    handleSelectDisplayBrowsers(browser);
                }}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{browser || "Unknown"}</span>
                {displayedBrowsers.includes(browser) && (
                  <CheckTwoTone className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault();
                    handleSetShowThisWebsite();
                }}
                className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <WebTwoTone className="h-4 w-4" />
                <span>This website</span>
              </div>
              {showThisWebsite && <CheckTwoTone className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Layout Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleLayout} className="h-10 w-10">
                {layout === "grid" ? <Grid3x3TwoTone /> : <ListAltTwoTone />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change layout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Sort Order Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleOrderBy} className="h-10 w-10">
                {orderBy === ORDER.TIME ? (
                  <TimelineTwoTone />
                ) : (
                  <SortByAlphaTwoTone />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Order by Time / Alphabet</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Toolbar;
