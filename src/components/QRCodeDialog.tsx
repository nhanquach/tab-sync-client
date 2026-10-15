import React, { useState } from "react";

import DownloadCard from "./CardDownload";
import QRCode from "./QRCode";
import CardShare from "./CardShare";
import InstallPwaDialog from "./InstallPwaDialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface IQRCodeDialogProps {
  /** Element that opens the dialog. */
  children: React.ReactNode;
}

const QRCodeDialog: React.FC<IQRCodeDialogProps> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get TabSync everywhere</DialogTitle>
          <DialogDescription>Scan to open TabSync on your phone, or add the extension to another browser.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-4">
          <QRCode width={168} height={168} />
          <InstallPwaDialog>
            <button type="button" className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              How to install the app on your phone
            </button>
          </InstallPwaDialog>
        </div>

        <DownloadCard />
        <CardShare />
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;
