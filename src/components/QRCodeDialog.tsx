import React, { useState } from "react";
import { CloseTwoTone, QrCode2TwoTone } from "@mui/icons-material";

import DownloadCard from "./CardDownload";
import QRCode from "./QRCode";
import CardShare from "./CardShare";

import { isMobileApp } from "../utils/isMobile";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
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
          className="flex min-w-[50px]"
        >
          <QrCode2TwoTone />
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "bg-white/90 dark:bg-black/90 backdrop-blur-3xl border border-white/20 shadow-2xl",
          isMobile
            ? "h-screen w-screen max-w-none pt-10 rounded-none"
            : "sm:max-w-5xl p-0 overflow-hidden sm:rounded-[32px]"
        )}
      >
        <div className="flex flex-col md:flex-row h-full md:min-h-[600px]">
          {/* Left Column (Hero) */}
          <div className="relative flex-1 p-6 md:p-10 flex flex-col justify-center items-center space-y-8 overflow-hidden">
             {/* Vibrant Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-900 dark:from-indigo-900 dark:to-black z-0" />

            {/* Decorative background circle/glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl z-0" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl z-0" />

            <div className="relative z-10 space-y-2 text-center animate-in fade-in slide-in-from-left-8 duration-700">
              <DialogTitle className="text-4xl md:text-5xl font-black tracking-tighter text-white drop-shadow-md">
                QR Code
              </DialogTitle>
              <DialogDescription className="text-lg md:text-xl text-indigo-100 font-medium">
                Scan to open on mobile
              </DialogDescription>
            </div>

            <div className="relative z-10 flex justify-center animate-in zoom-in-90 slide-in-from-bottom-8 duration-700 delay-100">
              <div className="bg-white p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                 <QRCode text={window.location.href} />
              </div>
            </div>
          </div>

          {/* Right Column (Actions) */}
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative bg-background/50 backdrop-blur-sm">
            {!isMobile && (
              <DialogClose className="absolute right-6 top-6 rounded-full p-2 opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <CloseTwoTone fontSize="large" />
                <span className="sr-only">Close</span>
              </DialogClose>
            )}

            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
              <DownloadCard />
              <CardShare />
            </div>

            {isMobile && (
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowModal(false)} className="w-full rounded-xl h-12 text-lg">
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
