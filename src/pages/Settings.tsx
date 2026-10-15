import React, { useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  BarChart3,
  ChevronRight,
  ExternalLink,
  KeyRound,
  LogOut,
  MessageSquare,
  QrCode,
  Smartphone,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { signOut } from "../clients/supabaseClient";
import AppShell from "../components/AppShell";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { AccountDeleteConfirmDialog } from "../components/AccountDeleteConfirmDialog";
import { ThemeSelector } from "../components/ThemeSelector";
import { StatsDialog } from "../components/StatsDialog";
import QRCodeDialog from "../components/QRCodeDialog";
import InstallPwaDialog from "../components/InstallPwaDialog";
import FeedbackDialog from "../components/FeedbackDialog";
import { EXTENSION_PAGE } from "../utils/constants";

interface ISettingsProps {
  user: User;
  /** Open the change-password form straight away (password-reset link). */
  openChangePassword?: boolean;
}

const Section: React.FC<{ label: string; tone?: "danger"; children: React.ReactNode }> = ({ label, tone, children }) => (
  <section className="space-y-2">
    <h2 className={cn("section-label", tone === "danger" && "text-destructive")}>{label}</h2>
    {children}
  </section>
);

const RowButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode; trailing?: React.ReactNode }
>(({ icon, trailing, children, className, ...props }, ref) => (
  <button ref={ref} type="button" className={cn("settings-row", className)} {...props}>
    <span className="text-muted-foreground">{icon}</span>
    <span className="min-w-0 flex-1 truncate">{children}</span>
    {trailing ?? <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />}
  </button>
));
RowButton.displayName = "RowButton";

const iconCls = "h-4 w-4";

const Settings: React.FC<ISettingsProps> = ({ user, openChangePassword = false }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(openChangePassword);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  const handleLogOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      setTimeout(() => {
        window.location.replace("/");
      }, 500);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AppShell active="settings" user={user}>
      <div className="pb-3 pt-4 md:pt-6">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">TabSync</p>
        <h1 className="text-base font-semibold leading-6">Settings</h1>
      </div>

      <div className="max-w-2xl space-y-6 pt-2">
        <Section label="Account">
          <div className="settings-group">
            <div className="settings-row">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold">
                {user.email?.charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate">{user.email}</span>
              <button
                type="button"
                onClick={handleLogOut}
                disabled={isLoggingOut}
                className="flex shrink-0 items-center gap-1.5 rounded px-1.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                {isLoggingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
            <RowButton
              icon={<KeyRound className={iconCls} />}
              onClick={() => setShowPasswordForm((v) => !v)}
              aria-expanded={showPasswordForm}
              trailing={
                <ChevronRight
                  className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", showPasswordForm && "rotate-90")}
                  aria-hidden
                />
              }
            >
              Change password
            </RowButton>
            {showPasswordForm && (
              <div className="bg-muted/30 p-3">
                <ChangePasswordForm handleCloseChangePasswordDialog={() => setShowPasswordForm(false)} />
              </div>
            )}
          </div>
        </Section>

        <Section label="Appearance">
          <ThemeSelector />
        </Section>

        <Section label="Apps & devices">
          <div className="settings-group">
            <QRCodeDialog>
              <RowButton icon={<QrCode className={iconCls} />}>Open TabSync on your phone</RowButton>
            </QRCodeDialog>
            <InstallPwaDialog>
              <RowButton icon={<Smartphone className={iconCls} />}>Install the app</RowButton>
            </InstallPwaDialog>
            <a href={EXTENSION_PAGE} target="_blank" rel="noopener noreferrer" className="settings-row">
              <span className="text-muted-foreground">
                <ExternalLink className={iconCls} />
              </span>
              <span className="min-w-0 flex-1 truncate">Get the browser extension</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            </a>
            <StatsDialog>
              <RowButton icon={<BarChart3 className={iconCls} />}>Insights</RowButton>
            </StatsDialog>
          </div>
        </Section>

        <Section label="Feedback">
          <div className="settings-group">
            <FeedbackDialog>
              <RowButton icon={<MessageSquare className={iconCls} />}>Report a bug or suggest a feature</RowButton>
            </FeedbackDialog>
          </div>
        </Section>

        <Section label="Danger zone" tone="danger">
          <div className="overflow-hidden rounded-lg border border-destructive/30 bg-card">
            <button
              type="button"
              onClick={() => setConfirmDeleteAccount(true)}
              className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/5"
            >
              <span>
                <span className="block">Delete account</span>
                <span className="block text-xs text-muted-foreground">Permanently remove your account and every synced tab.</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          </div>
        </Section>
      </div>

      <AccountDeleteConfirmDialog
        open={confirmDeleteAccount}
        onClose={() => setConfirmDeleteAccount(false)}
      />
    </AppShell>
  );
};

export default Settings;
