import React from "react";

import { EXTENSION_PAGE } from "../utils/constants";
import LogoWithTabSync from "./LogoWithTabSync";
import InstallPwaDialog from "./InstallPwaDialog";
import QRCodeDialog from "./QRCodeDialog";

interface IAuthLayoutProps {
  /** Hide the "open on your phone" link (already on a phone). */
  isMobile?: boolean;
  children: React.ReactNode;
}

const linkCls = "text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline";

/** Centered card used by sign in / sign up. */
const AuthLayout: React.FC<IAuthLayoutProps> = ({ isMobile, children }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <LogoWithTabSync className="mb-6 justify-center" />
        <div className="rounded-lg border border-border bg-card p-6">{children}</div>
        <p className="mt-3 text-center text-xs text-muted-foreground">Sync your open tabs across browsers and devices.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a href={EXTENSION_PAGE} target="_blank" rel="noopener noreferrer" className={linkCls}>
            Get the extension
          </a>
          <InstallPwaDialog>
            <button type="button" className={linkCls}>
              Install the app
            </button>
          </InstallPwaDialog>
          {!isMobile && (
            <QRCodeDialog>
              <button type="button" className={linkCls}>
                Open on your phone
              </button>
            </QRCodeDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
