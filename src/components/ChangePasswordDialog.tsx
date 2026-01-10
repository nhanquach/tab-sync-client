import React from "react";
import { KeyTwoTone } from "@mui/icons-material";
import ChangePasswordForm from "./ChangePasswordForm";
import { isMobileApp } from "../utils/isMobile";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordDialog: React.FC<IChangePasswordDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const isMobile = isMobileApp();

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "shadow-xl",
          // MD3 Styling Replacement with Asymmetric Quacky Shape
          "bg-md-sys-color-surface-container-high text-md-sys-color-on-surface border-none",
          isMobile
            ? "h-screen w-screen max-w-none pt-10 rounded-none overflow-y-auto"
            : "max-h-[85vh] overflow-y-auto sm:max-w-4xl p-0 rounded-tl-[32px] rounded-br-[32px] rounded-tr-[16px] rounded-bl-[16px] md:rounded-tl-[64px] md:rounded-br-[64px] md:rounded-tr-[24px] md:rounded-bl-[24px]"
        )}
      >
        {/* Accessible Title (Visually Hidden or Integrated) */}
        <DialogTitle className="sr-only">Change Password</DialogTitle>

        <div className={cn(
          "flex flex-col md:flex-row md:min-h-[450px]",
          "h-auto md:h-full"
        )}>
          {/* Left Column (Hero) - Quacky Expressive Style */}
          <div className="flex-1 p-6 md:p-10 bg-md-sys-color-tertiary-container text-md-sys-color-on-tertiary-container flex flex-col justify-center items-start space-y-6 md:space-y-8 relative overflow-hidden shrink-0">

            {/* Decorative background blob */}
            <div className="absolute -right-20 -top-20 w-40 h-40 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="flex items-center gap-2 transform -rotate-12 transition-transform hover:rotate-0 duration-500 origin-bottom-left">
              {/* Force large font size using Tailwind !text classes which override MUI styles */}
              <KeyTwoTone className="!text-6xl md:!text-8xl opacity-80" />
            </div>

            <div className="space-y-2 md:space-y-4 z-10">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                Secure your fortress <span className="inline-block hover:animate-bounce">🏰</span>
              </h2>
              <p className="text-lg md:text-xl font-medium opacity-90 max-w-sm">
                Keep your account safe with a strong password.
              </p>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative bg-transparent shrink-0">

            <ChangePasswordForm handleCloseChangePasswordDialog={handleClose} />

            {isMobile && (
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={handleClose} className="w-full rounded-full">
                  Close
                </Button>
              </DialogFooter>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
