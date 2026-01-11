import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Container, Snackbar } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import {
  getOpenTabs,
  getArchivedTabs,
  onOpenTabChange,
  onArchivedTabChange,
  archiveOpenTabs,
  removeArchivedTabs,
  sendTab,
  archiveTab,
  removeTab,
} from "../clients";
import UrlList from "../components/UrlList";
import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import { IDatabaseUpdatePayload } from "../interfaces/IDatabaseUpdate";
import { sortByTimeStamp } from "../utils/sortByTimeStamp";
import UrlGrid from "../components/UrlGrid";
import { sortByTitle } from "../utils/sortByTitle";
import { getNextTab } from "../utils/getNextTab";
import HomeSidebar from "../components/HomeSidebar";
import Toolbar from "../components/Toolbar";
import HomeAppBar, { headerHeight } from "../components/HomeAppBar";
import NoData from "../components/NoData";
import TipsFooter from "../components/TipsFooter";
import HomeBottomNavigationBar from "../components/HomeBottomNavigationBar";
import { isHistoryApiSupported } from "../utils/isHistoryAPISupported";
import { getItem, saveItem } from "../utils/LocalStorageHelper";
import {
  LAST_SAVED_ORDER_BY_KEY,
  LAYOUT,
  LAYOUT_KEY,
  ORDER,
} from "../utils/constants";
import { TABLES } from "../clients/constants";
import { Layout } from "../interfaces/Layout";
import { ROUTES } from "../routes";
import { cn } from "@/lib/utils";
import LoadingSpinner from "../components/LoadingSpinner";
import TabDetails from "../components/TabDetails";
import BulkActionsBar from "../components/BulkActionsBar";

interface IHomeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
}

const updateTabs = (currentTabs: ITab[], payload: IDatabaseUpdatePayload) => {
  if (payload.eventType === "UPDATE") {
    const index = currentTabs.findIndex((tab) => tab.id === payload.new.id);

    if (index > -1) {
      const newTabs = [...currentTabs];
      newTabs.splice(index, 1, payload.new);
      return newTabs;
    }

    return [payload.new, ...currentTabs];
  }

  if (payload.eventType === "DELETE") {
    return currentTabs.filter((t) => t.id !== payload.old.id);
  }

  return currentTabs;
};

const Home: React.FC<IHomeProps> = ({ user }) => {
  const { view, tabId } = useParams();
  const navigate = useNavigate();
  const currentView = (view as TABS_VIEWS);

  const [toast, setToast] = useState({ show: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!currentView || !Object.values(TABS_VIEWS).includes(currentView)) {
        navigate(`${ROUTES.HOME}/${TABS_VIEWS.OPEN_TABS}`, { replace: true });
    }
  }, [currentView, navigate]);

  const [tabs, setTabs] = useState<ITab[]>([]);
  const [archivedTabs, setArchivedTabs] = useState<ITab[]>([]);
  const [selectedTab, setSelectedTab] = useState<ITab | null>(null);

  // Bulk Actions State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTabIds, setSelectedTabIds] = useState<Set<number>>(new Set());

  const toggleSelectionMode = () => {
    setIsSelectionMode((prev) => {
        if (prev) {
            setSelectedTabIds(new Set()); // Clear selection when exiting mode
        }
        return !prev;
    });
  };

  const handleToggleTabSelection = (id: number) => {
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
            if (select) newSet.add(t.id);
            else newSet.delete(t.id);
        });
        return newSet;
    });
  };

  const handleBulkArchive = async () => {
    if (selectedTabIds.size === 0) return;
    const tabsToArchive = tabs.filter(t => selectedTabIds.has(t.id));

    // Optimistic update
    setTabs(prev => prev.filter(t => !selectedTabIds.has(t.id)));
    setSelectedTabIds(new Set());
    setIsSelectionMode(false);
    showToast(`${tabsToArchive.length} tabs archived.`);

    try {
      await archiveTab(tabsToArchive);
      await removeTab(Array.from(selectedTabIds.keys() as unknown as number[]));
    } catch (error) {
      console.error(error);
      showToast("Error archiving tabs. Refreshing...");
      handleRefresh();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTabIds.size === 0) return;

    // Optimistic update
    setArchivedTabs(prev => prev.filter(t => !selectedTabIds.has(t.id)));
    setSelectedTabIds(new Set());
    setIsSelectionMode(false);
    showToast(`${selectedTabIds.size} tabs deleted permanently.`);

    try {
      await removeTab(Array.from(selectedTabIds), TABLES.ARCHIVED_TABS);
    } catch (error) {
      console.error(error);
      showToast("Error deleting tabs. Refreshing...");
      handleRefresh();
    }
  };


  useEffect(() => {
    const allTabs = [...tabs, ...archivedTabs];
    if (tabId) {
      const tab = allTabs.find((t) => t.id.toString() === tabId);
      if (tab) {
        setSelectedTab(tab);
      }
    } else {
      setSelectedTab(null);
    }
  }, [tabId, tabs, archivedTabs]);

  const handleSelectTab = (tab: ITab | null) => {
    if (tab) {
      navigate(`${ROUTES.HOME}/${currentView}/${tab.id}`);
    } else {
      navigate(`${ROUTES.HOME}/${currentView}`);
    }
  };

  const [searchString, setSearchString] = useState<string>("");
  const [selectedDevice, setSelectedDevice] = useState<string>("All");

  const [layout, setLayout] = useState<Layout>(
    getItem(LAYOUT_KEY) || LAYOUT.LIST
  );
  const [orderBy, setOrderBy] = useState<ORDER>(
    getItem<ORDER>(LAST_SAVED_ORDER_BY_KEY) ?? ORDER.TIME
  );

  const isOpenTabsView = useMemo(() => currentView === TABS_VIEWS.OPEN_TABS, [currentView]);

  const browsers = useMemo(() => {
    const devices = Array.from(new Set(tabs.map((url) => url.deviceName)));
    return devices;
  }, [tabs]);

  const urls = useMemo(() => {
    let displayedTabs = isOpenTabsView ? tabs : archivedTabs;

    if (selectedDevice !== "All") {
      displayedTabs = displayedTabs.filter((tab) =>
        tab.deviceName === selectedDevice
      );
    }

    if (searchString) {
      displayedTabs = displayedTabs.filter(
        (tab) =>
          tab.title.toLowerCase().includes(searchString.toLowerCase()) ||
          tab.url.toLowerCase().includes(searchString.toLowerCase())
      );
    }

    return displayedTabs.sort(
      orderBy === ORDER.TIME ? sortByTimeStamp : sortByTitle
    );
  }, [
    isOpenTabsView,
    tabs,
    archivedTabs,
    selectedDevice,
    searchString,
    orderBy,
  ]);

  const handleGetTabs = useCallback(async () => {
    setIsLoading(true);
    const fetchFunction = isOpenTabsView ? getOpenTabs : getArchivedTabs;
    const setTabsFunction = isOpenTabsView ? setTabs : setArchivedTabs;

    const { data: newTabs, error } = await fetchFunction();

    if (error) {
      console.error(error);
      showToast("An error occurred while fetching open tabs.");
      setIsLoading(false);
      return;
    }

    newTabs.sort(sortByTimeStamp);
    setTabsFunction(newTabs);

    setIsLoading(false);
    showToast("Tabs are up to date.");
  }, [isOpenTabsView]);

  const toggleLayout = () => {
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

    if (
      (isOpenTabsView && tabs.length === 0) ||
      (!isOpenTabsView && archivedTabs.length === 0)
    )
      handleGetTabs();
  }, [currentView, handleGetTabs, tabs.length, archivedTabs.length, isOpenTabsView]);

  useEffect(() => {
    onOpenTabChange((payload: IDatabaseUpdatePayload) => {
      setTabs((currentTabs) => {
        return updateTabs(currentTabs, payload);
      });
    });
  }, [tabs]);

  useEffect(() => {
    onArchivedTabChange((payload: IDatabaseUpdatePayload) => {
      setArchivedTabs((currentTabs) => {
        return updateTabs(currentTabs, payload);
      });
    });
  }, [archivedTabs]);

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
    archiveOpenTabs(deviceName);
  };

  const clearArchivedTabs = (deviceName: string) => {
    removeArchivedTabs(deviceName);
  };

  const handleRefresh = async () => {
    setIsLoading(true);

    if (isOpenTabsView) {
      setTabs((await getOpenTabs()).data.sort(sortByTimeStamp));
    } else {
      setArchivedTabs((await getArchivedTabs()).data.sort(sortByTimeStamp));
    }

    setTimeout(() => {
      setIsLoading(false);
      showToast("Tabs are up to date.");
    }, 250);
  };

  const showToast = (message: string) => {
    setToast({
      show: true,
      message,
    });
  };

  const handleArchiveTab = async (tab: ITab) => {
    // Optimistic update
    const nextTab = getNextTab(tab, urls);
    setTabs((prev) => prev.filter((t) => t.id !== tab.id));
    handleSelectTab(nextTab);
    showToast("Tab archived.");

    try {
      await archiveTab([tab]);
      await removeTab([tab.id]);
    } catch (error) {
      console.error(error);
      showToast("Error archiving tab. Restoring...");
      setTabs((prev) => [...prev, tab].sort(sortByTimeStamp));
    }
  };

  const handleDeleteTab = async (tab: ITab) => {
    // Optimistic update
    const nextTab = getNextTab(tab, urls);
    setArchivedTabs((prev) => prev.filter((t) => t.id !== tab.id));
    handleSelectTab(nextTab);
    showToast("Tab deleted permanently.");

    try {
      await removeTab([tab.id], TABLES.ARCHIVED_TABS);
    } catch (error) {
      console.error(error);
      showToast("Error deleting tab. Restoring...");
      setArchivedTabs((prev) => [...prev, tab].sort(sortByTimeStamp));
    }
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

  return (
    <div className="min-h-screen bg-md-sys-color-surface flex flex-col">
      <HomeAppBar user={user} />

      <div className="flex flex-1">
          <HomeSidebar view={currentView} user={user} />

          <Container
            maxWidth="xl"
            className={cn(
                "flex-grow p-6 transition-all duration-300 min-w-0 relative mx-auto"
            )}
            sx={{
              mt: 0,
              paddingTop: { xs: `calc(${headerHeight}px + 24px)`, md: "24px" },
            }}
            component="main"
          >
            <div className="hidden md:flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <h1 className="text-4xl font-normal text-md-sys-color-on-surface tracking-tight">TabSync</h1>
            </div>

            <Toolbar
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
                isScrolled={isScrolled}
                isSelectionMode={isSelectionMode}
                toggleSelectionMode={toggleSelectionMode}
            />

            {isLoading && (
              <div className="absolute inset-0 z-50 flex items-start justify-center bg-md-sys-color-surface/50 backdrop-blur-sm pt-32">
                 <LoadingSpinner />
              </div>
            )}

            <div className="flex flex-col gap-6 md:flex-row md:gap-0 items-start relative min-h-0">
              <div className="flex-1 min-w-0">
                  {!isLoading && urls.length === 0 && (
                      <NoData isEmptySearch={!!searchString} />
                  )}

                  <div key={currentView} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {(urls.length > 0 && layout === "list") && (
                          <UrlList
                            view={currentView}
                            urls={urls}
                            onClear={isOpenTabsView ? clearOpenTabs : clearArchivedTabs}
                            onSelect={handleSelectTab}
                            selectedId={selectedTab?.id}
                            isSelectionMode={isSelectionMode}
                            selectedTabIds={selectedTabIds}
                            onToggleTabSelection={handleToggleTabSelection}
                            onToggleDeviceSelection={handleToggleDeviceSelection}
                          />
                      )}

                      {(urls.length > 0 && layout === "grid") && (
                          <UrlGrid
                            view={currentView}
                            urls={urls}
                            onClear={isOpenTabsView ? clearOpenTabs : clearArchivedTabs}
                            onSelect={handleSelectTab}
                            selectedId={selectedTab?.id}
                            isSelectionMode={isSelectionMode}
                            selectedTabIds={selectedTabIds}
                            onToggleTabSelection={handleToggleTabSelection}
                            onToggleDeviceSelection={handleToggleDeviceSelection}
                          />
                      )}
                  </div>
              </div>

              <div
                className={cn(
                  "hidden md:block sticky top-24 self-start overflow-hidden z-40",
                  "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  selectedTab ? "w-[400px] ml-6 opacity-100" : "w-0 ml-0 opacity-0"
                )}
                style={{ height: "calc(100vh - 8rem)" }}
              >
                <div className="w-[400px] h-full bg-md-sys-color-surface-container-low rounded-[24px] shadow-xl overflow-hidden border border-md-sys-color-outline-variant/20">
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
              </div>

              {selectedTab && (
                  <div 
                    className={cn(
                        "fixed inset-0 z-[100] flex items-end justify-center md:hidden",
                        "bg-black/60 backdrop-blur-sm",
                        "transition-all duration-300 ease-out animate-in fade-in"
                    )}
                    onClick={() => handleSelectTab(null)}
                  >
                      <div 
                        className={cn(
                            "w-full max-w-md shadow-2xl",
                            "h-[85vh]",
                            "bg-md-sys-color-surface-container-low",
                            "rounded-t-[32px]",
                            "overflow-hidden",
                            "animate-in slide-in-from-bottom-full duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                          <div className="flex justify-center pt-3 pb-1">
                              <div className="w-12 h-1.5 rounded-full bg-md-sys-color-outline-variant/40" />
                          </div>

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

            </div>

            <TipsFooter  />
            <HomeBottomNavigationBar view={currentView} setView={setViewAdapter} />

            <BulkActionsBar
              selectedCount={selectedTabIds.size}
              view={currentView}
              onClearSelection={() => setSelectedTabIds(new Set())}
              onArchiveSelected={handleBulkArchive}
              onDeleteSelected={handleBulkDelete}
            />

            <Snackbar
                open={toast.show}
                autoHideDuration={1000}
                onClose={closeToast}
                message={toast.message || ""}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
          </Container>
      </div>
    </div>
  );
};

export default Home;
