import React from "react";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { QrCode } from "lucide-react";

import { ROUTES } from "../routes";
import { TABS_VIEWS } from "../interfaces/iView";
import QRCodeDialog from "./QRCodeDialog";
import LogoWithTabSync from "./LogoWithTabSync";

interface IHomeAppBarProps {
  user?: User;
  isLoading?: boolean;
}

export const headerHeight = 48;

/** Mobile top bar: wordmark, app/QR, account. Hidden on desktop. */
const HomeAppBar: React.FC<IHomeAppBarProps> = ({ user, isLoading = false }) => {
  const initial = user?.email?.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-12 items-center gap-1 border-b border-border bg-background px-3 md:hidden">
      <Link to={`${ROUTES.HOME}/${TABS_VIEWS.OPEN_TABS}`} className="mr-auto">
        <LogoWithTabSync />
      </Link>
      <QRCodeDialog>
        <button type="button" className="icon-btn" aria-label="Get the app">
          <QrCode className="h-4 w-4" />
        </button>
      </QRCodeDialog>
      <Link to={ROUTES.SETTINGS} className="icon-btn" aria-label="Account settings">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
          {isLoading ? "" : initial}
        </span>
      </Link>
    </header>
  );
};

export default HomeAppBar;
