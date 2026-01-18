import React from "react";
import { IosShare, MoreVert, AddBox, ExitToApp, GetAppTwoTone } from "@mui/icons-material";
import { isMobileApp } from "../utils/isMobile";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IInstallPwaDialogProps {
    children?: React.ReactNode;
}

const InstallPwaDialog: React.FC<IInstallPwaDialogProps> = ({ children }) => {
  const isMobile = isMobileApp();
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button variant="link" className="text-muted-foreground p-0 h-auto">How to install?</Button>}
      </DialogTrigger>
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
        <div className={cn(
          "flex flex-col md:flex-row md:min-h-[450px]",
          "h-auto md:h-full"
        )}>
           {/* Left Column (Hero) */}
           <div className="flex-1 p-6 md:p-10 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-r border-white/20 dark:border-white/10 flex flex-col justify-center items-start space-y-6 md:space-y-8 relative overflow-hidden shrink-0">
                {/* Decorative background blob */}
                <div className="absolute -right-20 -top-20 w-40 h-40 md:w-64 md:h-64 bg-primary/10 rounded-full blur-3xl" />

                <div className="flex items-center gap-2 transform -rotate-12 transition-transform hover:rotate-0 duration-500 origin-bottom-left">
                  <GetAppTwoTone className="!text-6xl md:!text-8xl opacity-80" />
                </div>

                <div className="space-y-2 md:space-y-4 z-10">
                  <DialogTitle className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                    Install App <span className="inline-block hover:animate-bounce">📲</span>
                  </DialogTitle>
                  <DialogDescription className="text-lg md:text-xl font-medium opacity-90 max-w-sm text-foreground">
                    Get quick access from your home screen.
                  </DialogDescription>
                </div>
           </div>

           {/* Right Column (Instructions) */}
           <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative bg-white/30 dark:bg-black/20 backdrop-blur-sm shrink-0">
                <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-3">
                        <h4 className="font-bold text-foreground flex items-center gap-2 text-lg">
                            <span className="text-2xl">🍏</span> iOS (Safari)
                        </h4>
                        <ol className="list-decimal list-inside text-sm md:text-base text-muted-foreground space-y-2 ml-1">
                            <li className="flex items-center gap-1 flex-wrap">Tap the <span className="inline-flex items-center justify-center bg-background/50 rounded px-1 border border-border/50"><IosShare fontSize="inherit" className="mx-0.5"/> Share</span> button.</li>
                            <li className="flex items-center gap-1 flex-wrap">Scroll down and tap <span className="inline-flex items-center justify-center bg-background/50 rounded px-1 border border-border/50"><AddBox fontSize="inherit" className="mx-0.5"/> Add to Home Screen</span>.</li>
                        </ol>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-bold text-foreground flex items-center gap-2 text-lg">
                            <span className="text-2xl">🤖</span> Android (Chrome)
                        </h4>
                        <ol className="list-decimal list-inside text-sm md:text-base text-muted-foreground space-y-2 ml-1">
                            <li className="flex items-center gap-1 flex-wrap">Tap the <span className="inline-flex items-center justify-center bg-background/50 rounded px-1 border border-border/50"><MoreVert fontSize="inherit" className="mx-0.5"/> Menu</span> button.</li>
                            <li className="flex items-center gap-1 flex-wrap">Tap <span className="inline-flex items-center justify-center bg-background/50 rounded px-1 border border-border/50"><ExitToApp fontSize="inherit" className="mx-0.5"/> Install app</span>.</li>
                        </ol>
                    </div>
                </div>

                {isMobile && (
                  <DialogFooter className="mt-8">
                    <Button variant="outline" onClick={() => setOpen(false)} className="w-full rounded-full">
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

export default InstallPwaDialog;
