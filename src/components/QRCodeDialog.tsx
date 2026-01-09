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
          "bg-white/80 dark:bg-black/80 backdrop-blur-md border border-white/20 shadow-xl",
          isMobile
            ? "h-screen w-screen max-w-none pt-10"
            : "sm:max-w-5xl p-0 overflow-hidden"
        )}
      >
        <div className="flex flex-col md:flex-row h-full md:min-h-[600px]">
          {/* Left Column (Hero) */}
          <div className="flex-1 p-6 md:p-10 bg-primary/5 dark:bg-primary/10 flex flex-col justify-center items-center space-y-6">
            <div className="space-y-2 text-center">
              <DialogTitle className="text-3xl font-bold tracking-tight text-primary">QR Code</DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground">
                Scan to open on mobile
              </DialogDescription>
            </div>

            <div className="flex justify-center">
              <QRCode text={window.location.href} />
            </div>
          </div>

          {/* Right Column (Actions) */}
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative bg-background/50">
            {!isMobile && (
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <CloseTwoTone />
                <span className="sr-only">Close</span>
              </DialogClose>
            )}

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
