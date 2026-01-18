import React from "react";
import { Container } from "@mui/material";

import { cn } from "@/lib/utils";
import { headerHeight } from "./HomeAppBar";
import HomeSidebar from "./HomeSidebar";
import HomeAppBar from "./HomeAppBar";
import { TABS_VIEWS } from "../interfaces/iView";

const LoadingHomeShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-md-sys-color-surface flex flex-col">
      <HomeAppBar isLoading={true} />

      <div className="flex flex-1">
          {/* Default to OPEN_TABS view for the sidebar highlighting during load */}
          <HomeSidebar view={TABS_VIEWS.OPEN_TABS} isLoading={true} />

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
             <div className="hidden md:flex items-center gap-3 mb-8 opacity-50">
                <h1 className="text-4xl font-normal text-md-sys-color-on-surface tracking-tight">TabSync</h1>
            </div>

             <div className="flex h-full items-center justify-center -mt-20">
                <span className="text-lg text-md-sys-color-on-surface-variant font-medium animate-pulse">
                    Getting your tabs...
                </span>
             </div>
          </Container>
      </div>
    </div>
  );
};

export default LoadingHomeShell;
