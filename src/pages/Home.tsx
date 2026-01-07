import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Container, Snackbar, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import {
  getOpenTabs,
  getArchivedTabs,
  onOpenTabChange,
  onArchivedTabChange,
  archiveOpenTabs,
  removeArchivedTabs,
  sendTab,
} from "../clients";
import UrlList from "../components/UrlList";
import { ITab } from "../interfaces/iTab";
import { TABS_VIEWS } from "../interfaces/iView";
import { IDatabaseUpdatePayload } from "../interfaces/IDatabaseUpdate";
import { sortByTimeStamp } from "../utils/sortByTimeStamp";
import UrlGrid from "../components/UrlGrid";
import { sortByTitle } from "../utils/sortByTitle";
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
import { Layout } from "../interfaces/Layout";
import { drawerWidth } from "../utils/dimensions";
import { ROUTES } from "../routes";
import DeviceTabs from "../components/DeviceTabs";
import { cn } from "@/lib/utils";

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
  const params = useParams();
  const navigate = useNavigate();
  // Don't default to OPEN_TABS here, let the effect handle it
  const currentView = (params.view as TABS_VIEWS);

  const [toast, setToast] = useState({ show: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  // Validate view and redirect if missing or invalid
  useEffect(() => {
    if (!currentView || !Object.values(TABS_VIEWS).includes(currentView)) {
        navigate(`${ROUTES.HOME}/${TABS_VIEWS.OPEN_TABS}`, { replace: true });
    }
  }, [currentView, navigate]);

  const [tabs, setTabs] = useState<ITab[]>([]);
  const [archivedTabs, setArchivedTabs] = useState<ITab[]>([]);

  const [searchString, setSearchString] = useState<string>("");
  // Replaced displayedBrowsers (multi-select) with selectedDevice (single select)
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

    // Filter by selected device (if not "All")
    if (selectedDevice !== "All") {
      displayedTabs = displayedTabs.filter((tab) =>
        tab.deviceName === selectedDevice
      );
    }

    // apply search string if any
    if (searchString) {
      displayedTabs = displayedTabs.filter(
        (tab) =>
          tab.title.toLowerCase().includes(searchString.toLowerCase()) ||
          tab.url.toLowerCase().includes(searchString.toLowerCase())
      );
    }

    // removed filter for current website as the filter menu is gone

    return displayedTabs.sort(
      orderBy === ORDER.TIME ? sortByTimeStamp : sortByTitle
    );
  }, [
    isOpenTabsView,
    tabs,
    archivedTabs,
    selectedDevice, // Updated dependency
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

  // Get Open Tabs and Archived Tabs based on View
  useEffect(() => {
    // Only fetch if view is valid
    if (!currentView) return;

    if (
      (isOpenTabsView && tabs.length === 0) ||
      (!isOpenTabsView && archivedTabs.length === 0)
    )
      handleGetTabs();
  }, [currentView, handleGetTabs, tabs.length, archivedTabs.length, isOpenTabsView]);

  // On Open Tabs change
  useEffect(() => {
    onOpenTabChange((payload: IDatabaseUpdatePayload) => {
      setTabs((currentTabs) => {
        return updateTabs(currentTabs, payload);
      });
    });
  }, [tabs]);

  // On Archived Tabs change
  useEffect(() => {
    onArchivedTabChange((payload: IDatabaseUpdatePayload) => {
      setArchivedTabs((currentTabs) => {
        return updateTabs(currentTabs, payload);
      });
    });
  }, [archivedTabs]);

  // Send tab if is shared
  useEffect(() => {
    if (window.location.pathname === "/share") {
      try {
        const url = new URL(window.location.href);
        const title = url.searchParams.get("title");
        const text = url.searchParams.get("text");

        const randomId = parseInt((Math.random() * 1000000).toString());

        if (title && text) {
          // Checking if text is valid URL
          new URL(text);

          // Sending tab info to server
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
            // redirect to home in order to prevent duplicate tabs when refreshing
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
    // Logic for clearing tabs doesn't really need to update selectedDevice
    // but if the device disappears, we might want to switch to 'All'
    // For now, keep it simple.
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

  const closeToast = () => {
    setToast({
      show: false,
      message: "",
    });
  };

  // Adapter for BottomNav since we can't easily change it right now but want to keep it working
  // It expects a setter, so we give it a function that navigates.
  const setViewAdapter = (newView: TABS_VIEWS) => {
      navigate(`${ROUTES.HOME}/${newView}`);
  };

  // If redirecting, don't render content yet (or render loading)
  if (!currentView || !Object.values(TABS_VIEWS).includes(currentView)) {
      return null;
  }

  return (
    <div className="min-h-screen bg-md-sys-color-surface">
      <HomeAppBar user={user} />
      <HomeSidebar view={currentView} />
      <Container
        maxWidth={false} // Allow full width
        className={cn(
            "flex-grow p-6 transition-all duration-300",
            // Tailwind breakpoint matching Sidebar: md (768px)
            `md:ml-[${drawerWidth}px] md:w-[calc(100%-${drawerWidth}px)]`
        )}
        sx={{
          mt: 0,
          paddingTop: `${headerHeight + 24}px`,
          // We removed MUI specific width/margin breakpoints here to rely on Tailwind className
          // This ensures alignment with HomeSidebar's "md:flex"
        }}
        component="main"
      >
        <Toolbar
            isLoading={isLoading}
            handleRefresh={handleRefresh}
            searchString={searchString}
            handleSearch={handleSearch}
            toggleLayout={toggleLayout}
            layout={layout}
            toggleOrderBy={toggleOrderBy}
            orderBy={orderBy}
        />

        <DeviceTabs
            devices={browsers}
            selectedDevice={selectedDevice}
            onSelectDevice={setSelectedDevice}
        />

        {isLoading && (
            <Typography
            my={12}
            textAlign={{ xs: "center", md: "justify" }}
            color="#696969"
            variant="h5"
            >
            Getting your tabs ...
            </Typography>
        )}

        {!isLoading && urls.length === 0 && (
            <NoData isEmptySearch={!!searchString} />
        )}

        <div key={currentView} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!isLoading && urls.length > 0 && layout === "list" && (
                <UrlList
                view={currentView}
                urls={urls}
                onClear={isOpenTabsView ? clearOpenTabs : clearArchivedTabs}
                />
            )}

            {!isLoading && urls.length > 0 && layout === "grid" && (
                <UrlGrid
                view={currentView}
                urls={urls}
                onClear={isOpenTabsView ? clearOpenTabs : clearArchivedTabs}
                />
            )}
        </div>

        <TipsFooter  />
        <HomeBottomNavigationBar view={currentView} setView={setViewAdapter} />
        <Snackbar
            open={toast.show}
            autoHideDuration={1000}
            onClose={closeToast}
            message={toast.message || ""}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        />
      </Container>
    </div>
  );
};

export default Home;
