import React, { useState } from "react";
import { QrCode2TwoTone } from "@mui/icons-material";

import DownloadCard from "./CardDownload";
import QRCode from "./QRCode";
import CardShare from "./CardShare";

import { isMobileApp } from "../utils/isMobile";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

const QRCodeDialog: React.FC<Props> = () => {
  const isMobile = isMobileApp();
  const [showModal, setShowModal] = useState(false);

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Show QR code"
          className="flex min-w-[50px]"
        >
          <QrCode2TwoTone />
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "shadow-none md:shadow-2xl",
          // Material: Glassmorphism
          "backdrop-blur-xl",
          // Light Mode
          "bg-white/40 border-0 md:border md:border-white/40",
          // Dark Mode
          "dark:bg-black/40 dark:border-0 md:dark:border md:dark:border-white/10",

          isMobile
            ? "h-screen w-screen max-w-none pt-10 rounded-none overflow-y-auto"
            : "max-h-[85vh] overflow-y-auto sm:max-w-5xl p-0 rounded-tl-[32px] md:rounded-tl-[48px] md:rounded-tr-[16px] md:rounded-bl-[16px] md:rounded-br-[16px]"
        )}
      >
        <div className={cn(
          "flex flex-col md:flex-row md:min-h-[600px]",
          // Remove h-full on mobile to allow growing
          "h-auto md:h-full"
        )}>
          {/* Left Column (Hero) - Glassmorphic Style */}
          <div className="flex-1 p-6 md:p-10 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-r border-white/20 dark:border-white/10 flex flex-col justify-center items-center space-y-8 relative overflow-hidden shrink-0">

            {/* Decorative background blob */}
            <div className="absolute -left-20 -bottom-20 w-40 h-40 md:w-64 md:h-64 bg-primary/10 rounded-full blur-3xl" />

            <div className="flex items-center gap-2 transform rotate-12 transition-transform hover:rotate-0 duration-500">
               <QrCode2TwoTone className="!text-6xl md:!text-8xl opacity-80" />
            </div>

            <div className="space-y-2 md:space-y-4 z-10 text-center">
              <DialogTitle className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                Scan me <span className="inline-block hover:animate-bounce">🤳</span>
              </DialogTitle>
              <DialogDescription className="text-lg md:text-xl font-medium opacity-90 text-muted-foreground">
                To open on mobile
              </DialogDescription>
            </div>

            <div className="relative z-10 flex justify-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white p-4 rounded-[24px] shadow-lg">
                 <QRCode text={window.location.href} />
              </div>
            </div>
          </div>

          {/* Right Column (Actions) */}
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative bg-white/30 dark:bg-black/20 backdrop-blur-sm shrink-0">
            {/* Custom Close button removed to avoid duplicates */}

            <div className="flex flex-col gap-6">
              <DownloadCard />
              <CardShare />
            </div>

            {isMobile && (
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowModal(false)} className="w-full">
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

export default QRCodeDialog;
