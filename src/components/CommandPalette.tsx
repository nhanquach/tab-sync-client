import React from "react";
import {
  Archive,
  ArrowDownAZ,
  Clock,
  LayoutGrid,
  Layers,
  List,
  ListChecks,
  RefreshCw,
} from "lucide-react";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { TABS_VIEWS } from "../interfaces/iView";
import { ITab } from "../interfaces/iTab";
import { Layout } from "../interfaces/Layout";
import { ORDER } from "../utils/constants";
import { hostOf } from "../utils/tabMeta";
import Favicon from "./Favicon";

interface ICommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;

  view: TABS_VIEWS;
  setView: (view: TABS_VIEWS) => void;

  layout: Layout;
  toggleLayout: () => void;

  orderBy: ORDER;
  toggleOrderBy: () => void;

  isSelectionMode: boolean;
  toggleSelectionMode: () => void;

  handleRefresh: () => void;

  tabs: ITab[];
  onSelectTab: (tab: ITab) => void;
}

const TabItem = ({ tab, onSelect }: { tab: ITab; onSelect: () => void }) => {
  return (
    <CommandItem value={`${tab.title} ${tab.url} ${tab.deviceName}`} onSelect={onSelect}>
      <Favicon src={tab.favIconUrl} />
      <span className="min-w-0 flex-1 truncate">{tab.title}</span>
      <span className="max-w-[30%] shrink-0 truncate text-xs text-muted-foreground">{hostOf(tab.url)}</span>
      <span className="hidden max-w-[25%] shrink-0 truncate text-xs text-muted-foreground sm:inline">· {tab.deviceName}</span>
    </CommandItem>
  );
};

const CommandPalette: React.FC<ICommandPaletteProps> = ({
  isOpen,
  setIsOpen,
  view,
  setView,
  layout,
  toggleLayout,
  orderBy,
  toggleOrderBy,
  isSelectionMode,
  toggleSelectionMode,
  handleRefresh,
  tabs,
  onSelectTab,
}) => {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setIsOpen(false);
    command();
  }, [setIsOpen]);

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput placeholder="Type a command or search tabs…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
            <CommandItem onSelect={() => runCommand(handleRefresh)}>
                <RefreshCw />
                <span>Refresh tabs</span>
                <CommandShortcut>⌘R</CommandShortcut>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(toggleLayout)}>
                {layout === "grid" ? <List /> : <LayoutGrid />}
                <span>Switch to {layout === "grid" ? "list" : "grid"} view</span>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(toggleOrderBy)}>
                {orderBy === ORDER.TIME ? <ArrowDownAZ /> : <Clock />}
                <span>Sort by {orderBy === ORDER.TIME ? "title" : "time"}</span>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(toggleSelectionMode)}>
                <ListChecks />
                <span>{isSelectionMode ? "Exit" : "Enter"} selection mode</span>
            </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
            {view !== TABS_VIEWS.OPEN_TABS && (
                <CommandItem onSelect={() => runCommand(() => setView(TABS_VIEWS.OPEN_TABS))}>
                    <Layers />
                    <span>Go to open tabs</span>
                </CommandItem>
            )}

            {view !== TABS_VIEWS.ARCHIVED_TABS && (
                <CommandItem onSelect={() => runCommand(() => setView(TABS_VIEWS.ARCHIVED_TABS))}>
                    <Archive />
                    <span>Go to archived tabs</span>
                </CommandItem>
            )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Tabs">
            {tabs.map((tab) => (
                <TabItem
                    key={tab.uid}
                    tab={tab}
                    onSelect={() => runCommand(() => onSelectTab(tab))}
                />
            ))}
        </CommandGroup>

      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
