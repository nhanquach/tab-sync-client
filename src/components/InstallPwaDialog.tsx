import React from "react";
import { IosShare, MoreVert, AddBox, ExitToApp } from "@mui/icons-material";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface IInstallPwaDialogProps {
    children?: React.ReactNode;
}

const InstallPwaDialog: React.FC<IInstallPwaDialogProps> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || <Button variant="link" className="text-muted-foreground p-0 h-auto">How to install?</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Install TabSync</DialogTitle>
          <DialogDescription>
            Install TabSync on your home screen for quick access.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-4">
            <div className="space-y-2">
                 <h4 className="font-medium text-foreground flex items-center gap-2">
                    <span className="text-xl">🍏</span> iOS (Safari)
                 </h4>
                 <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-1">
                     <li className="flex items-center gap-1">Tap the <IosShare fontSize="small" className="mx-1"/> Share button.</li>
                     <li className="flex items-center gap-1">Scroll down and tap <AddBox fontSize="small" className="mx-1"/> Add to Home Screen.</li>
                 </ol>
            </div>

             <div className="space-y-2">
                 <h4 className="font-medium text-foreground flex items-center gap-2">
                    <span className="text-xl">🤖</span> Android (Chrome)
                 </h4>
                 <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-1">
                     <li className="flex items-center gap-1">Tap the <MoreVert fontSize="small" className="mx-1"/> Menu button.</li>
                     <li className="flex items-center gap-1">Tap <ExitToApp fontSize="small" className="mx-1"/> Install app or Add to Home Screen.</li>
                 </ol>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstallPwaDialog;
