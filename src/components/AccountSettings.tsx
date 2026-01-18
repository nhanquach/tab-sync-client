import React, { useMemo, useState } from "react";

import { User } from "@supabase/supabase-js";
import {
  KeyTwoTone,
  ExitToAppTwoTone,
  DeleteForeverTwoTone,
} from "@mui/icons-material";

import { signOut } from "../clients/supabaseClient";
import { AccountDeleteConfirmDialog } from "./AccountDeleteConfirmDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";

// Shadcn imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface IAccountSettingsProps {
  user?: User;
  isLoading?: boolean;
  tabCounts?: { open: number; archived: number };
}

const AccountSettings: React.FC<IAccountSettingsProps> = ({ user, isLoading = false, tabCounts }) => {
  const [open, setOpen] = React.useState(
    window.location.pathname === "/forgot-password"
  );
  const [isLogingOut, setIsLogingOut] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  const firstChar = useMemo(() => {
    return user?.email?.charAt(0).toUpperCase();
  }, [user]);

  const handleOpenChangePasswordDialog = () => {
    setOpen(true);
  };

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && window.location.pathname === "/forgot-password") {
      window.location.replace("/");
    }
  }


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
          <DropdownMenu>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {isLoading ? (
                    <Skeleton className="h-10 w-10 rounded-full" />
                  ) : (
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {isLogingOut ? (
                          <span className="animate-spin">C</span> // Placeholder for loading
                        ) : (
                          firstChar
                        )}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Account settings</p>
            </TooltipContent>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleOpenChangePasswordDialog}>
                <KeyTwoTone className="mr-2 h-4 w-4" />
                <span>Change password</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogOut}>
                <ExitToAppTwoTone className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="flex-col items-start opacity-100">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                      Free Tier Usage
                  </span>
                  <div className="flex flex-col gap-1 w-full">
                      <div className="flex justify-between text-xs w-full">
                          <span>Open Tabs</span>
                          <span className={tabCounts && tabCounts.open >= 200 ? "text-red-500 font-bold" : ""}>
                              {tabCounts?.open || 0} / 200
                          </span>
                      </div>
                      <div className="flex justify-between text-xs w-full">
                          <span>Archived</span>
                          <span className={tabCounts && tabCounts.archived >= 200 ? "text-red-500 font-bold" : ""}>
                              {tabCounts?.archived || 0} / 200
                          </span>
                      </div>
                  </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfirmDeleteAccount(true)}>
                <DeleteForeverTwoTone className="mr-2 h-4 w-4" />
                <span>Delete account</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Tooltip>
      </TooltipProvider>

      <ChangePasswordDialog open={open} onOpenChange={handleDialogChange} />

      <AccountDeleteConfirmDialog
        open={confirmDeleteAccount}
        onClose={() => setConfirmDeleteAccount(false)}
      />
    </>
  );
};

export default AccountSettings;
