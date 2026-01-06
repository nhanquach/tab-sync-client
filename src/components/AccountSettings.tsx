import React, { useMemo, useState } from "react";

import { User } from "@supabase/supabase-js";
import {
  KeyTwoTone,
  ExitToAppTwoTone,
  CloseTwoTone,
  DeleteForeverTwoTone,
} from "@mui/icons-material";

import { signOut } from "../clients/supabaseClient";
import { AccountDeleteConfirmDialog } from "./AccountDeleteConfirmDialog";
import { isMobileApp } from "../utils/isMobile";
import ChangePasswordForm from "./ChangePasswordForm";

// Shadcn imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface IAccountSettingsProps {
  user?: User;
}

const AccountSettings: React.FC<IAccountSettingsProps> = ({ user }) => {
  const isMobile = isMobileApp();

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

  const handleCloseChangePasswordDialog = () => {
    setOpen(false);

    if (window.location.pathname === "/forgot-password") {
      window.location.replace("/");
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
          <DropdownMenu>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {isLogingOut ? (
                        <span className="animate-spin">C</span> // Placeholder for loading
                      ) : (
                        firstChar
                      )}
                    </AvatarFallback>
                  </Avatar>
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
              <DropdownMenuItem onClick={() => setConfirmDeleteAccount(true)}>
                <DeleteForeverTwoTone className="mr-2 h-4 w-4" />
                <span>Delete account</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={isMobile ? "h-screen w-screen max-w-none pt-10" : "sm:max-w-[425px]"}>
          <DialogHeader className="flex flex-row items-center gap-2">
            <KeyTwoTone className="text-primary" />
            <DialogTitle>Change password</DialogTitle>
          </DialogHeader>
          <DialogClose onClick={handleCloseChangePasswordDialog} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <CloseTwoTone className="h-4 w-4" />
              <span className="sr-only">Close</span>
          </DialogClose>

          <ChangePasswordForm
            handleCloseChangePasswordDialog={handleCloseChangePasswordDialog}
          />
        </DialogContent>
      </Dialog>

      <AccountDeleteConfirmDialog
        open={confirmDeleteAccount}
        onClose={() => setConfirmDeleteAccount(false)}
      />
    </>
  );
};

export default AccountSettings;
