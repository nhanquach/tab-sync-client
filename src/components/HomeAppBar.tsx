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
}

export const headerHeight = 64; // Keeping logical height, though visual height might differ with padding

const HomeAppBar: React.FC<IHomeAppBarProps> = ({ user }) => {
  const isMobile = isMobileApp();

  return (
    <div className="flex flex-grow items-center justify-center">
      <header
        className={cn(
          "fixed z-50 flex items-center transition-all duration-300",
          // Floating Island Styles
          "top-4 left-4 right-4 h-16 rounded-2xl",
          "bg-md-sys-color-surface-container/80 backdrop-blur-md",
          "shadow-sm border border-white/20 dark:border-white/10",
          // Mobile adjustments
           isMobile ? "top-0 left-0 right-0 rounded-none border-t-0 border-x-0 pt-[25px]" : ""
        )}
      >
        <div className="flex w-full items-center px-6 h-full">
          <div className="flex-grow flex items-center">
             {/* Logo is now top-left, part of the full width header */}
            <LogoWithTabSync fontSizeVariant="h5" className="mb-0 text-md-sys-color-primary" />
          </div>
          <div className="flex gap-2 items-center">
            <QRCodeDialog />
            <FeedbackDialog />
            <AccountSettings user={user} />
          </div>
        </div>
      </header>
    </div>
  );
};

export default HomeAppBar;
