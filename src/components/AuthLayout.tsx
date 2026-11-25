import React from "react";

import { getExtensionPage } from "../utils/extension";
import ExtensionStoresDialog from "./ExtensionStoresDialog";
import LogoWithTabSync from "./LogoWithTabSync";
import InstallPwaDialog from "./InstallPwaDialog";
import QRCodeDialog from "./QRCodeDialog";
import Backdrop from "./Backdrop";

interface IAuthLayoutProps {
  /** Hide the "open on your phone" link (already on a phone). */
  isMobile?: boolean;
  children: React.ReactNode;
}

const linkCls = "text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline";

/** Centered card used by sign in / sign up. */
const AuthLayout: React.FC<IAuthLayoutProps> = ({ isMobile, children }) => {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Backdrop />
      <div className="w-full max-w-sm">
        <LogoWithTabSync className="mb-6 justify-center text-base" markClassName="h-9 w-9 rounded-[11px]" />
        <div className="glass-strong rounded-2xl p-6">{children}</div>
        <p className="mt-3 text-center text-xs text-muted-foreground">Sync your open tabs across browsers and devices.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-1.5">
            <a href={getExtensionPage()} target="_blank" rel="noopener noreferrer" className={linkCls}>
              Get the extension
            </a>
            <span className="text-xs text-muted-foreground/60" aria-hidden>
              ·
            </span>
            <ExtensionStoresDialog>
              <button type="button" className={linkCls}>
                Choose browser
              </button>
            </ExtensionStoresDialog>
          </span>
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
