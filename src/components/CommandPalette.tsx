import React from "react";
import {
  FolderOpenTwoTone,
  Inventory2TwoTone,
  RefreshTwoTone,
  Grid3x3TwoTone,
  ListAltTwoTone,
  SortByAlphaTwoTone,
  TimelineTwoTone,
  CheckCircleTwoTone,
  LaptopMacTwoTone,
  PhoneIphoneTwoTone,
  DevicesOtherTwoTone,
  PublicTwoTone,
  ViewColumnTwoTone,
} from "@mui/icons-material";

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
import { ORDER, LAYOUT } from "../utils/constants";
import { useLoadFavIcon } from "../hooks/useLoadFavIcon";

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
  const [showFallback, handleOnErrorImage] = useLoadFavIcon();

  const getDeviceIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("mac") || lower.includes("windows") || lower.includes("laptop"))
      return <LaptopMacTwoTone className="mr-2 h-4 w-4 opacity-50" />;
    if (lower.includes("iphone") || lower.includes("android") || lower.includes("mobile"))
      return <PhoneIphoneTwoTone className="mr-2 h-4 w-4 opacity-50" />;
    return <DevicesOtherTwoTone className="mr-2 h-4 w-4 opacity-50" />;
  };

  return (
    <CommandItem
      value={`${tab.title} ${tab.url} ${tab.deviceName}`}
      onSelect={onSelect}
      className="group"
    >
      <div className="flex items-center gap-3 w-full min-w-0">
        <div className="flex-shrink-0 w-6 h-6 rounded bg-white p-0.5 flex items-center justify-center">
            {!showFallback ? (
                <img
                    src={tab.favIconUrl}
                    alt=""
                    className="w-full h-full object-contain"
                    onError={handleOnErrorImage}
                />
            ) : (
                <PublicTwoTone className="text-md-sys-color-primary w-4 h-4" />
            )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
            <span className="truncate font-medium">{tab.title}</span>
            <span className="truncate text-xs text-md-sys-color-on-surface-variant opacity-70 flex items-center gap-1">
                {getDeviceIcon(tab.deviceName)}
                {tab.url}
            </span>
        </div>
      </div>
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
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
            <CommandItem onSelect={() => runCommand(handleRefresh)}>
                <RefreshTwoTone className="mr-2" />
                <span>Refresh Tabs</span>
                <CommandShortcut>⌘R</CommandShortcut>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(toggleLayout)}>
                {layout === LAYOUT.LIST && <Grid3x3TwoTone className="mr-2" />}
                {layout === LAYOUT.GRID && <ViewColumnTwoTone className="mr-2" />}
                {layout === LAYOUT.KANBAN && <ListAltTwoTone className="mr-2" />}
                <span>Switch to {layout === LAYOUT.LIST ? "Grid" : layout === LAYOUT.GRID ? "Kanban" : "List"} View</span>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(toggleOrderBy)}>
                {orderBy === ORDER.TIME ? <SortByAlphaTwoTone className="mr-2" /> : <TimelineTwoTone className="mr-2" />}
                <span>Sort by {orderBy === ORDER.TIME ? "Title" : "Time"}</span>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(toggleSelectionMode)}>
                <CheckCircleTwoTone className="mr-2" />
                <span>{isSelectionMode ? "Exit" : "Enter"} Selection Mode</span>
            </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
            {view !== TABS_VIEWS.OPEN_TABS && (
                <CommandItem onSelect={() => runCommand(() => setView(TABS_VIEWS.OPEN_TABS))}>
                    <FolderOpenTwoTone className="mr-2" />
                    <span>Go to Open Tabs</span>
                </CommandItem>
            )}

            {view !== TABS_VIEWS.ARCHIVED_TABS && (
                <CommandItem onSelect={() => runCommand(() => setView(TABS_VIEWS.ARCHIVED_TABS))}>
                    <Inventory2TwoTone className="mr-2" />
                    <span>Go to Archived Tabs</span>
                </CommandItem>
            )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Tabs">
            {tabs.map((tab) => (
                <TabItem
                    key={tab.id}
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
