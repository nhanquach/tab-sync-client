import React, { useRef } from "react";
import {
  RefreshTwoTone,
  Grid3x3TwoTone,
  ListAltTwoTone,
  TimelineTwoTone,
  SortByAlphaTwoTone,
  SearchTwoTone,
} from "@mui/icons-material";

import { Layout } from "../interfaces/Layout";
import { ORDER } from "../utils/constants";
import { useKeyPress } from "../hooks/useKeyPress";
import { isMobileDevice } from "../utils/isMobile";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

      {/* Actions Row - On mobile: Refresh + Layout + Sort. On Desktop: Layout + Sort */}
      <div className="flex items-center justify-between md:justify-start gap-1">
        {/* Mobile Refresh Button */}
        <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-10 w-10"
              aria-label="Refresh tabs"
            >
              {isLoading ? (
                 <RefreshTwoTone className="animate-spin" />
              ) : (
                <RefreshTwoTone />
              )}
            </Button>
        </div>

        {/* Layout Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleLayout} className="h-10 w-10" aria-label="Toggle layout">
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
              <Button variant="ghost" size="icon" onClick={toggleOrderBy} className="h-10 w-10" aria-label="Toggle sort order">
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