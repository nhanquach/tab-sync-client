import React, { useState } from "react";
import {
  DeleteForeverTwoTone,
  Loop,
  WarningTwoTone,
} from "@mui/icons-material";

import { signOut, deleteAccount } from "../clients/supabaseClient";
import { isMobileApp } from "../utils/isMobile";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IAccountDeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AccountDeleteConfirmDialog: React.FC<
  IAccountDeleteConfirmDialogProps
> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const isMobile = isMobileApp();

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await deleteAccount();
      await signOut();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        className={cn(
          "shadow-none md:shadow-2xl p-0 gap-0",
          // Material: Glassmorphism
          "backdrop-blur-xl",
          // Light Mode
          "bg-white/40 border-0 md:border md:border-white/40",
          // Dark Mode
          "dark:bg-black/40 dark:border-0 md:dark:border md:dark:border-white/10",

          isMobile
            ? "h-screen w-screen max-w-none rounded-none overflow-y-auto"
            : "max-h-[85vh] overflow-y-auto sm:max-w-4xl rounded-tl-[32px] md:rounded-tl-[48px] md:rounded-tr-[16px] md:rounded-bl-[16px] md:rounded-br-[16px]"
        )}
      >
        <div
          className={cn(
            "flex flex-col md:flex-row",
            // Minimum height for the split view effect on desktop
            "md:min-h-[450px]"
          )}
        >
          {/* Left Column (Hero) - Glassmorphic Style (Destructive) */}
          <div className="flex-1 p-8 md:p-12 bg-gradient-to-br from-destructive/20 via-destructive/5 to-transparent border-r border-white/20 dark:border-white/10 flex flex-col justify-center items-start space-y-6 relative overflow-hidden shrink-0">

            {/* Decorative background blob */}
            <div className="absolute -right-16 -top-16 w-32 h-32 md:w-56 md:h-56 bg-destructive/10 rounded-full blur-3xl" />

            <div className="flex items-center gap-2 transform -rotate-12 transition-transform hover:rotate-0 duration-500 origin-bottom-left z-10">
               {/* Force large font size */}
              <DeleteForeverTwoTone className="!text-7xl md:!text-9xl opacity-90" />
            </div>

            <div className="space-y-2 z-10">
              <DialogTitle className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
                Delete Account
              </DialogTitle>
              <p className="text-lg md:text-xl font-medium opacity-90">
                We're sorry to see you go.
              </p>
            </div>
          </div>

          {/* Right Column (Actions & Details) */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white/30 dark:bg-black/20 backdrop-blur-sm shrink-0 space-y-6">

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
                <WarningTwoTone className="shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm uppercase tracking-wide">Warning: Irreversible Action</h4>
                  <p className="text-sm opacity-90">
                    This action is <strong>irreversible</strong>. All your data will be permanently deleted within 24 hours.
                  </p>
                </div>
              </div>

              <DialogDescription className="text-muted-foreground text-base">
                Are you sure you want to delete your account? You will lose access to all your saved tabs and settings immediately.
              </DialogDescription>
            </div>

            <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-end pt-4">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={loading}
                className="w-full md:w-auto rounded-full"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                variant="destructive"
                disabled={loading}
                className="w-full md:w-auto gap-2 rounded-full"
              >
                {loading && <Loop className="animate-spin h-4 w-4" />}
                {loading ? "Deleting..." : "Delete Account"}
              </Button>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
