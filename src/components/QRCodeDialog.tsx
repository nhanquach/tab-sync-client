import React, { useState } from "react";
import { CloseTwoTone, QrCode2TwoTone } from "@mui/icons-material";

import DownloadCard from "./CardDownload";
import QRCode from "./QRCode";
import CardShare from "./CardShare";

import { isMobileApp } from "../utils/isMobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

      <DialogContent className="h-screen w-screen max-w-none pt-10 sm:max-w-none sm:h-auto sm:w-auto sm:rounded-lg">
        <DialogHeader className={isMobile ? "mt-2" : ""}>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>

        {!isMobile && (
           <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <CloseTwoTone />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}

        <div className="flex flex-col gap-4 py-4">
          <div className={`flex justify-center ${isMobile ? "mb-4 -mt-4" : "mb-8"}`}>
            <QRCode text={window.location.href} />
          </div>
          <DownloadCard />
          <CardShare />
        </div>

        <DialogFooter className={isMobile ? "mb-4" : ""}>
          <Button variant="ghost" onClick={() => setShowModal(false)} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;
