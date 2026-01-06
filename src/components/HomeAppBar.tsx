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

const HomeAppBar: React.FC<IHomeAppBarProps> = ({ user }) => {
  const isMobile = isMobileApp();

  return (
    <div className="flex flex-grow items-center">
      <header
        className={cn(
          "fixed top-0 right-0 z-50 flex items-center border-b-0 backdrop-blur-sm bg-background/30",
          isMobile ? "pt-[25px]" : "pt-0",
          "w-full md:w-[calc(100%-240px)]" // 240px is drawerWidth
        )}
      >
        <div className="flex w-full items-center px-6 min-h-[64px]">
          <div className="flex-grow -mb-[15px]">
            <LogoWithTabSync fontSizeVariant="h5" />
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
