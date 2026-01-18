import React, { useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  KeyTwoTone,
  ExitToAppTwoTone,
  DeleteForeverTwoTone,
  ArrowBack,
} from "@mui/icons-material";
import { signOut } from "../clients/supabaseClient";
import { AccountDeleteConfirmDialog } from "./AccountDeleteConfirmDialog";
import ChangePasswordForm from "./ChangePasswordForm";
import { isMobileApp } from "../utils/isMobile";

// Shadcn imports
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface IAccountSettingsProps {
  user?: User;
  isLoading?: boolean;
}

type ViewState = "menu" | "change-password";

const AccountSettings: React.FC<IAccountSettingsProps> = ({ user, isLoading = false }) => {
  const [open, setOpen] = useState(
    window.location.pathname === "/forgot-password"
  );
  const [view, setView] = useState<ViewState>("menu");
  const [isLogingOut, setIsLogingOut] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const isMobile = isMobileApp();

  const firstChar = useMemo(() => {
    return user?.email?.charAt(0).toUpperCase();
  }, [user]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        // Reset view when closing
        setTimeout(() => setView("menu"), 300);
        if (window.location.pathname === "/forgot-password") {
             window.location.replace("/");
        }
    }
  };

  const handleLogOut = async () => {
    try {
      setIsLogingOut(true);
      await signOut();
      setTimeout(() => {
        window.location.replace("/");
      }, 500);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLogingOut(false);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
           <Dialog open={open} onOpenChange={handleOpenChange}>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {isLoading ? (
                    <Skeleton className="h-10 w-10 rounded-full" />
                  ) : (
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {isLogingOut ? (
                          <span className="animate-spin">C</span>
                        ) : (
                          firstChar
                        )}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Account settings</p>
            </TooltipContent>

            <DialogContent className={cn(
                "shadow-none md:shadow-2xl",
                // Material: Glassmorphism
                "backdrop-blur-xl",
                // Light Mode
                "bg-white/40 border-0 md:border md:border-white/40",
                // Dark Mode
                "dark:bg-black/40 dark:border-0 md:dark:border md:dark:border-white/10",

                isMobile
                    ? "h-screen w-screen max-w-none pt-10 rounded-none overflow-y-auto"
                    : "max-h-[85vh] overflow-y-auto sm:max-w-4xl p-0 rounded-tl-[32px] md:rounded-tl-[48px] md:rounded-tr-[16px] md:rounded-bl-[16px] md:rounded-br-[16px]"
            )}>
                 {/* Accessible Title */}
                <DialogTitle className="sr-only">Account Settings</DialogTitle>

                <div className={cn(
                    "flex flex-col md:flex-row md:min-h-[450px]",
                    "h-auto md:h-full"
                )}>
                    {/* Left Column (Hero) */}
                    <div className="flex-1 p-6 md:p-10 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-r border-white/20 dark:border-white/10 flex flex-col justify-center items-start space-y-6 relative overflow-hidden shrink-0">
                         {/* Decorative background blob */}
                         <div className="absolute -right-20 -top-20 w-40 h-40 md:w-64 md:h-64 bg-primary/10 rounded-full blur-3xl" />

                        <div className="flex items-center gap-4 z-10">
                             <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white/50 dark:border-white/10 shadow-xl">
                                <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                                    {firstChar}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                         <div className="space-y-2 z-10">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">
                                My Account
                            </h2>
                            <p className="text-base md:text-lg font-medium opacity-80 break-all">
                                {user?.email}
                            </p>
                         </div>
                    </div>

                    {/* Right Column (Content) */}
                    <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative bg-white/30 dark:bg-black/20 backdrop-blur-sm shrink-0">
                        {view === "menu" ? (
                            <div className="grid grid-cols-1 gap-4 w-full animate-in slide-in-from-right-4 duration-300">
                                <Button
                                    variant="outline"
                                    className="justify-start h-14 text-base gap-3 rounded-2xl border-white/20 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10"
                                    onClick={() => setView("change-password")}
                                >
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <KeyTwoTone className="text-primary" />
                                    </div>
                                    Change password
                                </Button>

                                <Button
                                    variant="outline"
                                    className="justify-start h-14 text-base gap-3 rounded-2xl border-white/20 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10"
                                    onClick={handleLogOut}
                                >
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <ExitToAppTwoTone className="text-primary" />
                                    </div>
                                    Sign out
                                </Button>

                                <div className="pt-4 mt-4 border-t border-dashed border-border/50">
                                     <Button
                                        variant="ghost"
                                        className="justify-start w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-3"
                                        onClick={() => setConfirmDeleteAccount(true)}
                                    >
                                        <DeleteForeverTwoTone />
                                        Delete account
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full animate-in slide-in-from-right-8 duration-300">
                                <div className="flex items-center gap-2 mb-6">
                                    <Button variant="ghost" size="icon" onClick={() => setView("menu")} className="-ml-2 rounded-full">
                                        <ArrowBack />
                                    </Button>
                                    <h3 className="text-lg font-bold">Change Password</h3>
                                </div>
                                <ChangePasswordForm handleCloseChangePasswordDialog={() => {
                                    setView("menu"); // Go back to menu first? Or close? User might want to stay.
                                    // The prompt implies closing the dialog usually.
                                    // Original logic closed dialog. Let's close dialog.
                                    setOpen(false);
                                }} />
                            </div>
                        )}
                    </div>
                </div>

            </DialogContent>
          </Dialog>
        </Tooltip>
      </TooltipProvider>

      <AccountDeleteConfirmDialog
        open={confirmDeleteAccount}
        onClose={() => setConfirmDeleteAccount(false)}
      />
    </>
  );
};

export default AccountSettings;
