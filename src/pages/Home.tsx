import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Snackbar } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import {
  getOpenTabs,
  getArchivedTabs,
  onOpenTabChange,
  onArchivedTabChange,
  sendTab,
  archiveTab,
  removeTab,
} from "../clients";
import UrlList from "../components/UrlList";
import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import { sortByTimeStamp } from "../utils/sortByTimeStamp";
import UrlGrid from "../components/UrlGrid";
import { getNextTab } from "../utils/getNextTab";
import AppShell from "../components/AppShell";
import Toolbar from "../components/Toolbar";
import NoData from "../components/NoData";
import TipsFooter from "../components/TipsFooter";
import { isHistoryApiSupported } from "../utils/isHistoryAPISupported";
import { getItem, saveItem } from "../utils/LocalStorageHelper";
import {
  LAST_SAVED_ORDER_BY_KEY,
  LAYOUT,
  LAYOUT_KEY,
  ORDER,
} from "../utils/constants";
import { isMobileApp } from "../utils/isMobile";
import { TABLES } from "../clients/constants";
import { Layout } from "../interfaces/Layout";
import { ROUTES } from "../routes";
import { cn } from "@/lib/utils";
import TabDetails from "../components/TabDetails";
import BulkActionsBar from "../components/BulkActionsBar";
import PaginationControls from "../components/PaginationControls";
import CommandPalette from "../components/CommandPalette";

interface IHomeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
}

const Home: React.FC<IHomeProps> = ({ user }) => {
  const { view, tabId } = useParams();
  const navigate = useNavigate();
  const currentView = (view as TABS_VIEWS);

  const [toast, setToast] = useState({ show: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    if (!currentView || !Object.values(TABS_VIEWS).includes(currentView)) {
        navigate(`${ROUTES.HOME}/${TABS_VIEWS.OPEN_TABS}`, { replace: true });
    }
  }, [currentView, navigate]);

  const [tabs, setTabs] = useState<ITab[]>([]);
  const [archivedTabs, setArchivedTabs] = useState<ITab[]>([]);
  const [selectedTab, setSelectedTab] = useState<ITab | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Bulk Actions State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTabIds, setSelectedTabIds] = useState<Set<string>>(new Set());
  const [exitingTabIds, setExitingTabIds] = useState<Set<string>>(new Set());

  const toggleSelectionMode = () => {
    setIsSelectionMode((prev) => {
        if (prev) {
            setSelectedTabIds(new Set()); // Clear selection when exiting mode
        }
        return !prev;
    });
  };

  const handleToggleTabSelection = (id: string) => {
    setSelectedTabIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleToggleDeviceSelection = (deviceName: string, select: boolean) => {
    const tabsToProcess = isOpenTabsView ? tabs : archivedTabs;
    const deviceTabs = tabsToProcess.filter(t => t.deviceName === deviceName);

    setSelectedTabIds((prev) => {
        const newSet = new Set(prev);
        deviceTabs.forEach(t => {
            if (select) newSet.add(t.uid);
            else newSet.delete(t.uid);
        });
        return newSet;
    });
  };

  const handleBulkArchive = async () => {
    if (selectedTabIds.size === 0) return;
    const tabsToArchive = tabs.filter(t => selectedTabIds.has(t.uid));

    // Optimistic animation start
    setExitingTabIds(new Set(selectedTabIds));
    setIsSelectionMode(false);
    setSelectedTabIds(new Set());

    setTimeout(async () => {
        // Optimistic update after animation
        setTabs(prev => prev.filter(t => !selectedTabIds.has(t.uid)));
        setExitingTabIds(new Set());
        showToast(`${tabsToArchive.length} tabs archived.`);

        try {
          await archiveTab(tabsToArchive);
          await removeTab(Array.from(selectedTabIds));
        } catch (error) {
          console.error(error);
          showToast("Error archiving tabs. Refreshing...");
          handleRefresh();
        }
    }, 300);
  };

  const handleBulkDelete = async () => {
    if (selectedTabIds.size === 0) return;

    // Optimistic animation start
    setExitingTabIds(new Set(selectedTabIds));
    setIsSelectionMode(false);
    setSelectedTabIds(new Set());

    setTimeout(async () => {
        // Optimistic update after animation
        setArchivedTabs(prev => prev.filter(t => !selectedTabIds.has(t.uid)));
        setExitingTabIds(new Set());
        showToast(`${selectedTabIds.size} tabs deleted permanently.`);

        try {
          await removeTab(Array.from(selectedTabIds), TABLES.ARCHIVED_TABS);
        } catch (error) {
          console.error(error);
          showToast("Error deleting tabs. Refreshing...");
          handleRefresh();
        }
    }, 300);
  };


  useEffect(() => {
    const allTabs = [...tabs, ...archivedTabs];
    if (tabId) {
      const tab = allTabs.find((t) => t.uid === tabId);
      if (tab) {
        setSelectedTab(tab);
      }
    } else {
      setSelectedTab(null);
    }
  }, [tabId, tabs, archivedTabs]);

  const handleSelectTab = (tab: ITab | null) => {
    if (tab) {
      navigate(`${ROUTES.HOME}/${currentView}/${tab.uid}`);
    } else {
      navigate(`${ROUTES.HOME}/${currentView}`);
    }
  };

  const [searchString, setSearchString] = useState<string>("");
  const [selectedDevice, setSelectedDevice] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 20;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || isMobileApp());
    const handleResize = () => setIsMobile(window.innerWidth < 768 || isMobileApp());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [layout, setLayout] = useState<Layout>(
    getItem(LAYOUT_KEY) || LAYOUT.LIST
  );

  // Phones always use the dense list (same rows as the extension).
  useEffect(() => {
    if (isMobile && layout !== LAYOUT.LIST) {
        setLayout(LAYOUT.LIST);
    }
  }, [isMobile, layout]);

  const [orderBy, setOrderBy] = useState<ORDER>(
    getItem<ORDER>(LAST_SAVED_ORDER_BY_KEY) ?? ORDER.TIME
  );

  const isOpenTabsView = useMemo(() => currentView === TABS_VIEWS.OPEN_TABS, [currentView]);

  const browsers = useMemo(() => {
    const devices = Array.from(new Set(tabs.map((url) => url.deviceName)));
    return devices;
  }, [tabs]);

  const urls = useMemo(() => {
    return isOpenTabsView ? tabs : archivedTabs;
  }, [isOpenTabsView, tabs, archivedTabs]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchString, selectedDevice, currentView, orderBy]);

  const handleGetTabs = useCallback(async () => {
    setIsLoading(true);
    const fetchFunction = isOpenTabsView ? getOpenTabs : getArchivedTabs;
    const setTabsFunction = isOpenTabsView ? setTabs : setArchivedTabs;

    const { data: newTabs, count, error } = await fetchFunction(
      currentPage,
      ITEMS_PER_PAGE,
      searchString,
      selectedDevice,
      orderBy === ORDER.TIME ? "TIME" : "TITLE"
    );

    if (error) {
      console.error(error);
      showToast("An error occurred while fetching open tabs.");
      setIsLoading(false);
      return;
    }

    // newTabs.sort(sortByTimeStamp); // Sorting is now done on server
    setTabsFunction(newTabs);
    setTotalCount(count);

    setIsLoading(false);
    showToast("Tabs are up to date.");
  }, [
    isOpenTabsView,
    currentPage,
    searchString,
    selectedDevice,
    orderBy,
  ]);

  const toggleLayout = () => {
    if (isMobile) return;
    setLayout((currentLayout: Layout) => {
      const newLayout =
        currentLayout === LAYOUT.GRID ? LAYOUT.LIST : LAYOUT.GRID;

      saveItem(LAYOUT_KEY, newLayout);
      return newLayout;
    });
  };

  const toggleOrderBy = () => {
    setOrderBy((currentOrderBy) => {
      const order = currentOrderBy === ORDER.TIME ? ORDER.TITLE : ORDER.TIME;
      saveItem(LAST_SAVED_ORDER_BY_KEY, order.toString());
      return order;
    });
  };

  useEffect(() => {
    if (!currentView) return;
    handleGetTabs();
  }, [currentView, handleGetTabs]);

  useEffect(() => {
    onOpenTabChange(() => {
      // Simplest way to handle real-time updates with pagination is to just refresh the current page
      handleGetTabs();
    });
  }, [handleGetTabs]);

  useEffect(() => {
    onArchivedTabChange(() => {
      // Simplest way to handle real-time updates with pagination is to just refresh the current page
      handleGetTabs();
    });
  }, [handleGetTabs]);

  useEffect(() => {
    if (window.location.pathname === "/share") {
      try {
        const url = new URL(window.location.href);
        const title = url.searchParams.get("title");
        const text = url.searchParams.get("text");

        const randomId = parseInt((Math.random() * 1000000).toString());

        if (title && text) {
          new URL(text);

          sendTab({
            id: randomId,
            url: text,
            favIconUrl: "",
            title: title,
            index: 0,
            timeStamp: new Date().toLocaleDateString(),
            deviceName: "TabSync Web Client",
            windowId: "TabSync Web Client",
          }).then(() => {
            if (isHistoryApiSupported()) {
              window.history.pushState({}, "", "/");
            } else {
              window.location.replace("/");
            }
            showToast("Tab is synced successfully!");
          });
        }
      } catch {
        console.error("Is not valid url! Skipping...");
        showToast("Is not valid url! Skipping...");
      }
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = (e: any) => {
    setSearchString(e.target.value);
  };

  const clearOpenTabs = (deviceName: string) => {
    const tabsToArchive = tabs.filter((t) => t.deviceName === deviceName);
    if (tabsToArchive.length === 0) return;

    // Optimistic animation start
    const ids = tabsToArchive.map((t) => t.uid);
    setExitingTabIds(new Set(ids));

    setTimeout(async () => {
      // Optimistic update after animation
      setTabs((prev) => prev.filter((t) => t.deviceName !== deviceName));
      setExitingTabIds(new Set());
      showToast(`${tabsToArchive.length} tabs archived.`);

      try {
        await archiveTab(tabsToArchive);
        await removeTab(ids);
      } catch (error) {
        console.error(error);
        showToast("Error archiving tabs. Refreshing...");
        handleRefresh();
      }
    }, 300);
  };

  const clearArchivedTabs = (deviceName: string) => {
    const tabsToDelete = archivedTabs.filter((t) => t.deviceName === deviceName);
    if (tabsToDelete.length === 0) return;

    // Optimistic animation start
    const ids = tabsToDelete.map((t) => t.uid);
    setExitingTabIds(new Set(ids));

    setTimeout(async () => {
      // Optimistic update after animation
      setArchivedTabs((prev) => prev.filter((t) => t.deviceName !== deviceName));
      setExitingTabIds(new Set());
      showToast(`${tabsToDelete.length} tabs deleted permanently.`);

      try {
        await removeTab(ids, TABLES.ARCHIVED_TABS);
      } catch (error) {
        console.error(error);
        showToast("Error deleting tabs. Refreshing...");
        handleRefresh();
      }
    }, 300);
  };

  const handleRefresh = async () => {
    handleGetTabs();
  };

  const showToast = (message: string) => {
    setToast({
      show: true,
      message,
    });
  };

  const handleArchiveTab = async (tab: ITab) => {
    const nextTab = getNextTab(tab, urls);
    handleSelectTab(nextTab);

    // Optimistic animation start
    setExitingTabIds(new Set([tab.uid]));

    setTimeout(async () => {
        // Optimistic update after animation
        setTabs((prev) => prev.filter((t) => t.uid !== tab.uid));
        setExitingTabIds(new Set());
        showToast("Tab archived.");

        try {
          await archiveTab([tab]);
          await removeTab([tab.uid]);
        } catch (error) {
          console.error(error);
          showToast("Error archiving tab. Restoring...");
          setTabs((prev) => [...prev, tab].sort(sortByTimeStamp));
        }
    }, 300);
  };

  const handleDeleteTab = async (tab: ITab) => {
    const nextTab = getNextTab(tab, urls);
    handleSelectTab(nextTab);

    // Optimistic animation start
    setExitingTabIds(new Set([tab.uid]));

    setTimeout(async () => {
        // Optimistic update after animation
        setArchivedTabs((prev) => prev.filter((t) => t.uid !== tab.uid));
        setExitingTabIds(new Set());
        showToast("Tab deleted permanently.");

        try {
          await removeTab([tab.uid], TABLES.ARCHIVED_TABS);
        } catch (error) {
          console.error(error);
          showToast("Error deleting tab. Restoring...");
          setArchivedTabs((prev) => [...prev, tab].sort(sortByTimeStamp));
        }
    }, 300);
  };

  const closeToast = () => {
    setToast({
      show: false,
      message: "",
    });
  };


  const prevSelectedTab = useRef<ITab | null>(null);
  if (selectedTab) {
    prevSelectedTab.current = selectedTab;
  }
  const desktopTab = selectedTab || prevSelectedTab.current;

  const setViewAdapter = (newView: TABS_VIEWS) => {
      navigate(`${ROUTES.HOME}/${newView}`);
  };

  if (!currentView || !Object.values(TABS_VIEWS).includes(currentView)) {
      return null;
  }

  const detailsPanel = (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 overflow-hidden glass-bar transition-[width] duration-200 md:block",
        selectedTab ? "glass-bar-left w-[360px]" : "w-0"
      )}
      aria-hidden={!selectedTab}
    >
      <div className="h-full w-[360px]">
        {desktopTab && (
          <TabDetails
            tab={desktopTab}
            view={currentView}
            onClose={() => handleSelectTab(null)}
            onArchive={handleArchiveTab}
            onDelete={handleDeleteTab}
          />
        )}
      </div>
    </aside>
  );

  return (
    <AppShell
      active={isOpenTabsView ? "open" : "archived"}
      user={user}
      isLoading={isLoading}
      activeCount={totalCount}
      devices={browsers}
      selectedDevice={selectedDevice}
      onSelectDevice={setSelectedDevice}
      aside={detailsPanel}
    >
      <Toolbar
          title={isOpenTabsView ? "Open tabs" : "Archived tabs"}
          count={totalCount}
          isLoading={isLoading}
          handleRefresh={handleRefresh}
          searchString={searchString}
          handleSearch={handleSearch}
          toggleLayout={toggleLayout}
          layout={layout}
          toggleOrderBy={toggleOrderBy}
          orderBy={orderBy}
          devices={browsers}
          selectedDevice={selectedDevice}
          onSelectDevice={setSelectedDevice}
          isSelectionMode={isSelectionMode}
          toggleSelectionMode={toggleSelectionMode}
          isMobile={isMobile}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {isLoading && urls.length === 0 ? (
        <div className="space-y-1" aria-hidden>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="shimmer h-9 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className={cn("transition-opacity", isLoading && "opacity-60")}>
          {urls.length === 0 && <NoData isEmptySearch={!!searchString} />}

          {urls.length > 0 && layout === "list" && (
            <UrlList
              view={currentView}
              urls={urls}
              onClear={isOpenTabsView ? clearOpenTabs : clearArchivedTabs}
              onSelect={handleSelectTab}
              selectedId={selectedTab?.uid}
              isSelectionMode={isSelectionMode}
              selectedTabIds={selectedTabIds}
              onToggleTabSelection={handleToggleTabSelection}
              onToggleDeviceSelection={handleToggleDeviceSelection}
              exitingTabIds={exitingTabIds}
              isSearching={!!searchString}
            />
          )}

          {urls.length > 0 && layout === "grid" && (
            <UrlGrid
              view={currentView}
              urls={urls}
              onClear={isOpenTabsView ? clearOpenTabs : clearArchivedTabs}
              onSelect={handleSelectTab}
              selectedId={selectedTab?.uid}
              isSelectionMode={isSelectionMode}
              selectedTabIds={selectedTabIds}
              onToggleTabSelection={handleToggleTabSelection}
              onToggleDeviceSelection={handleToggleDeviceSelection}
              exitingTabIds={exitingTabIds}
            />
          )}

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {urls.length > 0 && layout === "list" && (
            <p className="hidden pt-1 text-center text-[11px] text-muted-foreground md:block">
              ↑↓ to move · ↵ to open · / to search · Esc to clear · ⌘K for commands
            </p>
          )}
        </div>
      )}

      <TipsFooter />

      {/* Mobile: details as a bottom sheet */}
      {selectedTab && (
        <div
          className="fixed inset-0 z-[60] flex items-end bg-black/40 duration-200 animate-in fade-in md:hidden"
          onClick={() => handleSelectTab(null)}
        >
          <div
            className="h-[80vh] w-full overflow-hidden glass-strong rounded-t-2xl border-x-0 border-b-0 duration-300 animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <TabDetails
              tab={selectedTab}
              view={currentView}
              onClose={() => handleSelectTab(null)}
              onArchive={handleArchiveTab}
              onDelete={handleDeleteTab}
            />
          </div>
        </div>
      )}

      <BulkActionsBar
        selectedCount={selectedTabIds.size}
        view={currentView}
        onClearSelection={() => setSelectedTabIds(new Set())}
        onArchiveSelected={handleBulkArchive}
        onDeleteSelected={handleBulkDelete}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        setIsOpen={setIsCommandPaletteOpen}
        view={currentView}
        setView={setViewAdapter}
        layout={layout}
        toggleLayout={toggleLayout}
        orderBy={orderBy}
        toggleOrderBy={toggleOrderBy}
        isSelectionMode={isSelectionMode}
        toggleSelectionMode={toggleSelectionMode}
        handleRefresh={handleRefresh}
        tabs={isOpenTabsView ? tabs : archivedTabs}
        onSelectTab={handleSelectTab}
      />

      <Snackbar
        open={toast.show}
        autoHideDuration={1000}
        onClose={closeToast}
        message={toast.message || ""}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </AppShell>
  );
};

export default Home;
