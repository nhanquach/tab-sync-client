import React from "react";
import { SpeedTwoTone, StorageTwoTone } from "@mui/icons-material";

import { isMobileApp } from "../utils/isMobile";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LimitInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LimitInfoDialog = ({ open, onOpenChange }: LimitInfoDialogProps) => {
  const isMobile = isMobileApp();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "shadow-xl",
          // Solid Geometric Style
          "bg-card/85 backdrop-blur-md text-card-foreground border-none",
          isMobile
            ? "h-screen w-screen max-w-none pt-10 rounded-none overflow-y-auto"
            : "max-h-[85vh] overflow-y-auto sm:max-w-4xl p-0 rounded-3xl"
        )}
      >
        <div className={cn(
          "flex flex-col md:flex-row md:min-h-[500px]",
          "h-auto md:h-full"
        )}>
          {/* Left Column (Hero) */}
          <div className="flex-1 p-6 md:p-10 bg-primary/5 flex flex-col justify-center items-start space-y-6 md:space-y-8 relative overflow-hidden shrink-0">

            {/* Decorative background blob */}
            <div className="absolute -right-20 -top-20 w-40 h-40 md:w-64 md:h-64 bg-primary/10 rounded-full blur-3xl" />

            <div className="flex items-center gap-2 transform -rotate-6 transition-transform hover:rotate-0 duration-500 origin-bottom-left z-10">
              <SpeedTwoTone className="!text-6xl md:!text-8xl opacity-80 text-primary" />
            </div>

            <div className="space-y-2 md:space-y-4 z-10">
              <DialogTitle className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
                Fair Usage <br /> Policy
              </DialogTitle>
              <DialogDescription className="text-lg md:text-xl font-medium opacity-80 max-w-sm text-foreground/80">
                Keeping TabSync fast & free for everyone.
              </DialogDescription>
            </div>
          </div>

          {/* Right Column (Content) */}
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative bg-transparent shrink-0">
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <StorageTwoTone color="primary" />
                        The Limit
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                        We currently sync the most recent <strong>200 Open Tabs</strong> and <strong>200 Archived Tabs</strong> per account. Older tabs are automatically rotated out to make room for new ones.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-2">Why this limit?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        To ensure sustainable performance and provide a reliable free service for our entire community, we implement these quotas. This covers 99% of daily workflows while preventing any single account from impacting the system's speed.
                    </p>
                </div>

                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-sm font-medium text-primary">
                        <strong>Tip:</strong> You can export your data anytime or delete old devices to free up space in your view, though the limit applies to your total account cloud storage.
                    </p>
                </div>
            </div>

            {isMobile && (
              <DialogFooter className="mt-8">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
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

export default LimitInfoDialog;
