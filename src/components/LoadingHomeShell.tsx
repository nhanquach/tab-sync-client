import React from "react";
import { Container } from "@mui/material";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { drawerWidth } from "../utils/dimensions";
import { headerHeight } from "./HomeAppBar";
import { HomeSkeletonGrid } from "./HomeSkeletonGrid";

const LoadingHomeShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-md-sys-color-surface flex flex-col">
      {/* Mobile AppBar Skeleton */}
      <div className="flex flex-grow items-center justify-center md:hidden">
        <header
          className={cn(
            "fixed z-50 flex items-center transition-all duration-300",
            "top-0 left-0 right-0 h-16",
            "bg-md-sys-color-surface-container/95 backdrop-blur-md",
            "shadow-sm border-b border-white/10",
            "pt-[25px]"
          )}
        >
          <div className="flex w-full items-center px-4 h-full justify-between">
            <Skeleton className="h-6 w-32 rounded bg-muted" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full bg-muted" />
              <Skeleton className="h-8 w-8 rounded-full bg-muted" />
              <Skeleton className="h-8 w-8 rounded-full bg-muted" />
            </div>
          </div>
        </header>
      </div>

      <div className="flex flex-1">
        {/* Desktop Sidebar Skeleton */}
        <aside
          className={cn(
            "sticky z-40 hidden md:flex flex-col items-center justify-between py-6",
            "bg-md-sys-color-surface-container shadow-sm border border-white/20 dark:border-white/10",
            "rounded-2xl ml-4 mb-4"
          )}
          style={{
            width: drawerWidth,
            top: "1.5rem",
            height: `calc(100vh - 3rem)`,
          }}
        >
          <div className="flex flex-col items-center gap-8 w-full">
            <Skeleton className="h-10 w-10 rounded-xl bg-muted" />
            <div className="flex flex-col gap-6 w-full items-center mt-4">
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-8 w-12 rounded-full bg-muted" />
                <Skeleton className="h-2 w-8 rounded bg-muted" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-8 w-12 rounded-full bg-muted" />
                <Skeleton className="h-2 w-10 rounded bg-muted" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 mb-2">
            <Skeleton className="h-8 w-8 rounded-full bg-muted" />
            <Skeleton className="h-8 w-8 rounded-full bg-muted" />
            <Skeleton className="h-10 w-10 rounded-full bg-muted" />
          </div>
        </aside>

        {/* Main Content Area Skeleton */}
        <Container
          maxWidth={false}
          className={cn("flex-grow p-6 transition-all duration-300 min-w-0")}
          sx={{
            mt: 0,
            paddingTop: { xs: `calc(${headerHeight}px + 24px)`, md: "24px" },
          }}
          component="main"
        >
          {/* Header */}
          <div className="hidden md:flex items-center gap-3 mb-8">
            <Skeleton className="h-10 w-48 rounded bg-muted" />
          </div>

          {/* Toolbar Skeleton */}
          <div className="flex flex-col md:flex-row gap-2 md:items-center w-full mt-2 mb-4">
            <Skeleton className="hidden md:block h-10 w-10 rounded bg-muted" />
            <Skeleton className="h-10 flex-1 rounded bg-muted" />
            <div className="flex gap-1 justify-between md:justify-start">
               <Skeleton className="md:hidden h-10 w-10 rounded bg-muted" />
               <Skeleton className="h-10 w-10 rounded bg-muted" />
               <Skeleton className="h-10 w-10 rounded bg-muted" />
            </div>
          </div>

          {/* Device Tabs Skeleton */}
           <div
            className={cn(
                "sticky z-30 w-full py-3 mb-6 -mx-6 px-6",
                "bg-md-sys-color-surface/95 backdrop-blur-sm",
                "border-b border-md-sys-color-outline-variant/20",
                "flex items-center gap-2",
                "top-16 md:top-0"
            )}
             style={{ width: "calc(100% + 48px)" }}
            >
              <Skeleton className="h-8 w-16 rounded-lg bg-muted" />
              <Skeleton className="h-8 w-24 rounded-lg bg-muted" />
              <Skeleton className="h-8 w-20 rounded-lg bg-muted" />
           </div>


          {/* Grid/List Skeletons */}
          <HomeSkeletonGrid />
        </Container>
      </div>
    </div>
  );
};

export default LoadingHomeShell;
