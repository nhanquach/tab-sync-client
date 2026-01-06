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

export const headerHeight = 64; // Exporting for layout calculations

const HomeAppBar: React.FC<IHomeAppBarProps> = ({ user }) => {
  const isMobile = isMobileApp();

  return (
    <div className="flex flex-grow items-center">
      <header
        className={cn(
          "fixed top-0 left-0 z-50 flex items-center border-b bg-background", // Removed offset/width logic, added border-b, solid bg
          isMobile ? "pt-[25px]" : "pt-0",
          "w-full h-16" // h-16 is 64px
        )}
      >
        <div className="flex w-full items-center px-6 h-full">
          <div className="flex-grow flex items-center">
            {/* Logo is now top-left, part of the full width header */}
            <LogoWithTabSync fontSizeVariant="h5" className="mb-0" />
          </div>
          <div className="flex gap-1 items-center">
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
