import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDownAZ,
  Check,
  ChevronDown,
  Clock,
  Command,
  LayoutGrid,
  List,
  ListChecks,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { Layout } from "../interfaces/Layout";
import { ORDER } from "../utils/constants";
import { useKeyPress } from "../hooks/useKeyPress";
import { cn } from "@/lib/utils";
import { DeviceChip } from "./DeviceIcon";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IToolbarProps {
  title: string;
  count?: number;
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
  isSelectionMode?: boolean;
  toggleSelectionMode?: () => void;
  isMobile?: boolean;
  onOpenCommandPalette?: () => void;
}

/** Page header (product label + title + actions) and the search field. */
const Toolbar: React.FC<IToolbarProps> = ({
  title,
  count,
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
  isSelectionMode,
  toggleSelectionMode,
  isMobile = false,
  onOpenCommandPalette,
}) => {
  const searchBoxRef = useRef<HTMLInputElement>(null);

  // The sticky bar only frosts once the list scrolls under it; at rest it is part of the page.
  const [isStuck, setIsStuck] = useState(false);
  useEffect(() => {
    const onScroll = () => setIsStuck(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useKeyPress({
    keys: ["/"],
    callback: () => {
      searchBoxRef.current?.focus();
    },
    isCombinedWithCtrl: false,
  });

  // Focus search on load (desktop only, so phones don't pop the keyboard).
  useEffect(() => {
    if (!isMobile && window.matchMedia("(min-width: 768px)").matches) {
      searchBoxRef.current?.focus();
    }
  }, [isMobile]);

  const clearSearch = () => handleSearch({ target: { value: "" } });

  // Esc clears the search from anywhere on the page (unless a dialog is open).
  const searchRef = useRef(searchString);
  searchRef.current = searchString;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !searchRef.current) return;
      if (document.querySelector('[role="dialog"], [role="menu"]')) return;
      handleSearch({ target: { value: "" } });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSearch]);

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && searchString) {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      clearSearch();
    }
  };

  const deviceLabel = selectedDevice === "All" ? "All devices" : selectedDevice;

  return (
    <div className={cn(
        "sticky top-12 z-30 -mx-4 px-4 pb-3 pt-4 transition-[background-color,border-color] duration-150 md:top-0 md:-mx-8 md:px-8 md:pt-6",
        "border-b border-transparent",
        isStuck && "page-bar border-[color:var(--glass-border)]"
      )}>
      <div className="flex items-center gap-1">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">TabSync</p>
          <h1 className="flex min-w-0 items-baseline gap-2 text-base font-semibold leading-6">
            <span className="truncate">{title}</span>
            {selectedDevice !== "All" && (
              <span className="hidden truncate text-sm font-normal text-muted-foreground md:inline">· {selectedDevice}</span>
            )}
            {count !== undefined && !isLoading && (
              <span className="shrink-0 text-sm font-normal tabular-nums text-muted-foreground">{count}</span>
            )}
          </h1>
        </div>

        {/* Device filter lives in the sidebar on desktop. */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="mr-1 flex h-8 max-w-[132px] items-center gap-1 glass rounded-lg px-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
              aria-label="Filter by device"
            >
              <span className="truncate">{deviceLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {["All", ...devices].map((device) => (
              <DropdownMenuItem key={device} onClick={() => onSelectDevice(device)}>
                {device === "All" ? <span className="h-4 w-4" /> : <DeviceChip name={device} size="sm" />}
                <span className="min-w-0 flex-1 truncate">{device === "All" ? "All devices" : device}</span>
                {selectedDevice === device && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          className="icon-btn"
          onClick={handleRefresh}
          disabled={isLoading}
          aria-label="Refresh tabs"
          title="Refresh"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={toggleOrderBy}
          aria-label={orderBy === ORDER.TIME ? "Sort by name" : "Sort by time"}
          title={orderBy === ORDER.TIME ? "Sorted by time · switch to name" : "Sorted by name · switch to time"}
        >
          {orderBy === ORDER.TIME ? <Clock className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />}
        </button>
        {!isMobile && (
          <button
            type="button"
            className="icon-btn hidden md:inline-flex"
            onClick={toggleLayout}
            aria-label={layout === "grid" ? "Switch to list view" : "Switch to grid view"}
            title={layout === "grid" ? "Switch to list view" : "Switch to grid view"}
          >
            {layout === "grid" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </button>
        )}
        {toggleSelectionMode && (
          <button
            type="button"
            className={cn("icon-btn", isSelectionMode && "bg-primary/40 text-primary-foreground hover:bg-primary/50 hover:text-primary-foreground dark:bg-primary/15 dark:text-primary-ink dark:hover:text-primary-ink")}
            onClick={toggleSelectionMode}
            aria-label={isSelectionMode ? "Exit selection mode" : "Enter selection mode"}
            aria-pressed={!!isSelectionMode}
            title={isSelectionMode ? "Exit selection mode" : "Select tabs"}
          >
            <ListChecks className="h-4 w-4" />
          </button>
        )}
        {onOpenCommandPalette && (
          <button
            type="button"
            className="icon-btn hidden md:inline-flex"
            onClick={onOpenCommandPalette}
            aria-label="Open command palette"
            title="Command palette (⌘K)"
          >
            <Command className="h-4 w-4" />
          </button>
        )}
      </div>

      <label className="glass-strong focus-ring mt-3 flex h-10 items-center gap-2 rounded-xl px-3">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          ref={searchBoxRef}
          data-search-input
          value={searchString}
          onChange={handleSearch}
          onKeyDown={onSearchKeyDown}
          placeholder={count ? `Search ${count.toLocaleString()} tabs by title or URL` : "Search tabs by title or URL"}
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          aria-label="Search tabs"
        />
        {searchString ? (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <span className="kbd hidden md:inline-flex" aria-hidden>
            /
          </span>
        )}
      </label>
    </div>
  );
};

export default Toolbar;
