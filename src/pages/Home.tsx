import React, { useEffect, useMemo, useState } from "react";
import {
  getOpenTabs,
  getArchivedTabs,
  onOpenTabChange,
  onArchivedTabChange,
  archiveOpenTabs,
  removeArchivedTabs,
} from "../clients";
import UrlList from "../components/UrlList";
import { ITab } from "../interfaces/iTab";
import { IView } from "../interfaces/iView";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArchiveTwoTone,
  CheckTwoTone,
  CloudSyncTwoTone,
  DevicesTwoTone,
  Grid3x3TwoTone,
  LightbulbCircleTwoTone,
  ListAltTwoTone,
  RefreshTwoTone,
} from "@mui/icons-material";
import { IDatabaseUpdatePayload } from "../interfaces/IDatabaseUpdate";
import { sortByTimeStamp } from "../utils/sortByTimeStamp";
import QRCode from "../components/QRCode";
import UrlGrid from "../components/UrlGrid";

const drawerWidth = 240;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<IView>("open_tabs");

  const [tabs, setTabs] = useState<ITab[]>([]);
  const [archivedTabs, setArchivedTabs] = useState<ITab[]>([]);

  const [searchString, setSearchString] = useState<string>();
  const [filters, setFilters] = useState<string[]>([]);

  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isOpenTabsView = view === "open_tabs";

  const browsers = useMemo(() => {
    const devices = Array.from(new Set(tabs.map((url) => url.deviceName)));
    return devices;
  }, [tabs]);

  const urls = useMemo(() => {
    let displayedTabs = isOpenTabsView ? tabs : archivedTabs;

    // apply filters if any
    if (filters.length > 0) {
      displayedTabs = displayedTabs.filter((tab) =>
        filters.includes(tab.deviceName)
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

    return displayedTabs.sort(sortByTimeStamp);
  }, [isOpenTabsView, tabs, archivedTabs, filters, searchString]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGetOpenTabs = async () => {
    setLoading(true);

    const { data: newTabs, error } = await getOpenTabs();

    if (error) {
      console.error(error);
      return;
    }

    setTabs(newTabs.sort(sortByTimeStamp));
    setLoading(false);
  };

  const handleGetArchivedTabs = async () => {
    setLoading(true);

    const { data: newTabs, error } = await getArchivedTabs();

    if (error) {
      console.error(error);
      return;
    }

    setArchivedTabs(newTabs.sort(sortByTimeStamp));
    setLoading(false);
  };

  const toggleLayout = () => {
    setLayout((currentLayout) => (currentLayout === "grid" ? "list" : "grid"));
  };

  // Get Open Tabs and Archived Tabs based on View
  useEffect(() => {
    if (view === "open_tabs" && tabs.length === 0) {
      handleGetOpenTabs();
    } else if (view === "archived_tabs" && archivedTabs.length === 0) {
      handleGetArchivedTabs();
    }
  }, [archivedTabs.length, tabs.length, view]);

  // On Open Tabs change
  useEffect(() => {
    onOpenTabChange((payload: IDatabaseUpdatePayload) => {
      if (payload.eventType === "UPDATE") {
        setTabs((currentTabs) => {
          const index = currentTabs.findIndex(
            (tab) => tab.id === payload.new.id
          );

          if (index > -1) {
            const newTabs = [...currentTabs];
            newTabs.splice(index, 1, payload.new);
            return newTabs;
          }

          return [payload.new, ...currentTabs];
        });
      }

      if (payload.eventType === "DELETE") {
        setTabs((currentTabs) =>
          currentTabs.filter((t) => t.id !== payload.old.id)
        );
      }
    });
  }, [tabs]);

  // On Archived Tabs change
  useEffect(() => {
    onArchivedTabChange((payload: IDatabaseUpdatePayload) => {
      if (payload.eventType === "UPDATE") {
        setArchivedTabs((currentTabs) => {
          const index = currentTabs.findIndex(
            (tab) => tab.id === payload.new.id
          );

          if (index > -1) {
            const newTabs = [...currentTabs];
            newTabs.splice(index, 1, payload.new);
            return newTabs;
          }

          return [payload.new, ...currentTabs];
        });
      }

      if (payload.eventType === "DELETE") {
        setArchivedTabs((currentTabs) =>
          currentTabs.filter((t) => t.id !== payload.old.id)
        );
      }
    });
  }, [archivedTabs]);

  // Select all devices as filters
  useEffect(() => {
    const devices = Array.from(new Set(tabs.map((url) => url.deviceName)));
    setFilters(devices);
  }, [tabs]);

  const handleSearch = (e: any) => {
    setSearchString(e.target.value);
  };

  const clearOpenTabs = (deviceName: string) => {
    archiveOpenTabs(deviceName);
    setFilters(filters.filter((f) => f !== deviceName));
  };

  const clearArchivedTabs = (deviceName: string) => {
    removeArchivedTabs(deviceName);
    setFilters(filters.filter((f) => f !== deviceName));
  };

  const handleRefresh = async () => {
    setLoading(true);

    if (isOpenTabsView) {
      setTabs((await getOpenTabs()).data.sort(sortByTimeStamp));
    } else {
      setArchivedTabs((await getArchivedTabs()).data.sort(sortByTimeStamp));
    }

    setTimeout(() => {
      setLoading(false);
    }, 250);
  };

  const drawer = (
    <Box pt={8}>
      <List>
        <ListItemButton
          sx={{ mb: 2 }}
          selected={view === "open_tabs"}
          onClick={() => setView("open_tabs")}
        >
          <ListItemIcon>
            <CloudSyncTwoTone sx={{ fontSize: 30 }} />
          </ListItemIcon>
          <ListItemText primary="Open tabs" />
        </ListItemButton>
        <ListItemButton
          sx={{ mb: 2 }}
          selected={view === "archived_tabs"}
          onClick={() => setView("archived_tabs")}
        >
          <ListItemIcon>
            <ArchiveTwoTone sx={{ fontSize: 30 }} />
          </ListItemIcon>
          <ListItemText primary="Archived tabs" />
        </ListItemButton>
        <Divider sx={{ pt: 6 }} />
        <ListItem>
          <ListItemIcon
            style={{ maxWidth: "100%" }}
            sx={{
              backdropFilter: "blur(8px)",
            }}
          >
            <QRCode />
          </ListItemIcon>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box display="flex" gap={1}>
        <Tooltip title="Refresh">
          <IconButton onClick={handleRefresh}>
            {loading ? <CircularProgress size={20} /> : <RefreshTwoTone />}
          </IconButton>
        </Tooltip>
        <TextField
          size="small"
          type="text"
          placeholder="Find your tabs"
          value={searchString}
          onChange={handleSearch}
          fullWidth
        />
        <Tooltip title="Device Filters">
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <DevicesTwoTone />
          </IconButton>
        </Tooltip>
        <Menu
          id="filter-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuList>
            <ListItemText sx={{ px: 2 }}>
              <Typography>Available devices:</Typography>
              <Typography variant="subtitle2">
                Click to hide or unhide devices from the list
              </Typography>
            </ListItemText>

            {browsers.map((browser: string) => {
              return (
                <MenuItem
                  key={browser}
                  onClick={() => {
                    if (filters.includes(browser)) {
                      setFilters(filters.filter((f) => f !== browser));
                    } else {
                      setFilters([...filters, browser]);
                    }
                  }}
                >
                  <ListItemIcon>
                    {filters.includes(browser) && <CheckTwoTone />}
                  </ListItemIcon>
                  <ListItemText>{browser}</ListItemText>
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
        <Tooltip title="Change layouts">
          <IconButton about="View as grid" onClick={toggleLayout}>
            {layout === "grid" ? <Grid3x3TwoTone /> : <ListAltTwoTone />}
          </IconButton>
        </Tooltip>
      </Box>

      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          mt={6}
          alignItems="center"
          gap={2}
          color="#696969"
        >
          Getting your tabs...
        </Box>
      )}

      {!loading && layout === "list" && (
        <UrlList
          view={view}
          urls={urls}
          onClear={isOpenTabsView ? clearOpenTabs : clearArchivedTabs}
        />
      )}

      {!loading && layout === "grid" && (
        <UrlGrid
          view={view}
          urls={urls}
          onClear={isOpenTabsView ? clearOpenTabs : clearArchivedTabs}
        />
      )}

      {!loading && (
        <LightbulbCircleTwoTone
          fontSize="large"
          sx={{ display: "flex", width: "100%", my: 2 }}
          color="primary"
        />
      )}

      {!isOpenTabsView && !loading && (
        <Typography textAlign="center" color="#696969">
          Tab Sync was created to make your browsers hopping a breeze, since all
          your tabs are synced.
          <br />
          Happing browsing
        </Typography>
      )}

      {isOpenTabsView && !loading && (
        <Typography textAlign="center" color="#696969">
          <span>
            <b>Tip</b>: If your tabs are not showing up, one possible reason is
            that you are signed out of the extension.
            <br />
            To check, click on the extension icon in your browser toolbar and
            sign in.
          </span>
        </Typography>
      )}

      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: { md: "none" },
        }}
        elevation={3}
        className="bottom-navigation"
      >
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <BottomNavigation
          showLabels
          value={view}
          onChange={(_event, newValue) => {
            setView(newValue);
          }}
        >
          <BottomNavigationAction
            value="open_tabs"
            label="Open tabs"
            icon={<CloudSyncTwoTone />}
          />
          <BottomNavigationAction
            value="archived_tabs"
            label="Archived tabs"
            icon={<ArchiveTwoTone />}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default Home;
