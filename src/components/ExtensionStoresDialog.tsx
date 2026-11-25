import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DownloadCard from "./CardDownload";

interface IExtensionStoresDialogProps {
  /** Element that opens the browser store chooser dialog. */
  children: React.ReactNode;
}

const ExtensionStoresDialog: React.FC<IExtensionStoresDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Browser extension</DialogTitle>
          <DialogDescription>Choose your browser store to install the TabSync extension.</DialogDescription>
        </DialogHeader>

        <DownloadCard showHeading={false} />
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionStoresDialog;
