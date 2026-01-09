import React from "react";
import { Container } from "@mui/material";

import { cn } from "@/lib/utils";
import { drawerWidth } from "../utils/dimensions";
import { headerHeight } from "./HomeAppBar";
import HomeSidebar from "./HomeSidebar";
import HomeAppBar from "./HomeAppBar";
import LoadingSpinner from "./LoadingSpinner";
import { TABS_VIEWS } from "../interfaces/iView";

const LoadingHomeShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-md-sys-color-surface flex flex-col">
      <HomeAppBar />

      <div className="flex flex-1">
          {/* Default to OPEN_TABS view for the sidebar highlighting during load */}
          <HomeSidebar view={TABS_VIEWS.OPEN_TABS} />

          <Container
            maxWidth={false}
            className={cn(
                "flex-grow p-6 transition-all duration-300 min-w-0"
            )}
            sx={{
              mt: 0,
              paddingTop: { xs: `calc(${headerHeight}px + 24px)`, md: "24px" },
            }}
            component="main"
          >
             <div className="flex h-full items-center justify-center">
                <LoadingSpinner />
             </div>
          </Container>
      </div>
    </div>
  );
};

export default LoadingHomeShell;
