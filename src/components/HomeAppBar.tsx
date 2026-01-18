import React from "react";
import { User } from "@supabase/supabase-js";

import { isMobileApp } from "../utils/isMobile";

import FeedbackDialog from "./FeedbackDialog";
import AccountSettings from "./AccountSettings";
import QRCodeDialog from "./QRCodeDialog";
import LogoWithTabSync from "./LogoWithTabSync";
import { cn } from "@/lib/utils";

interface IHomeAppBarProps {
  user?: User;
  isLoading?: boolean;
  tabCounts?: { open: number; archived: number };
}

export const headerHeight = 64;

const HomeAppBar: React.FC<IHomeAppBarProps> = ({ user, isLoading = false, tabCounts }) => {
  const isMobile = isMobileApp();

  return (
    <div className="flex flex-grow items-center justify-center md:hidden"> {/* Hidden on desktop */}
      <header
        className={cn(
          "fixed z-50 flex items-center transition-all duration-300",
          "top-0 left-0 right-0 h-16",
          "bg-md-sys-color-surface-container/95 backdrop-blur-md", // Opaque for mobile
          "shadow-sm border-b border-white/10",
           isMobile ? "pt-[25px]" : ""
        )}
      >
        <div className="flex w-full items-center px-4 h-full justify-between">
          <div className="flex items-center">
            <LogoWithTabSync fontSizeVariant="h6" className="mb-0 text-md-sys-color-primary" />
          </div>
          <div className="flex gap-1 items-center">
            <QRCodeDialog />
            <FeedbackDialog />
            <AccountSettings user={user} isLoading={isLoading} tabCounts={tabCounts} />
          </div>
        </div>
      </header>
    </div>
  );
};

export default HomeAppBar;
