import React from "react";
import { EllipsisVertical, Share, SquarePlus, Download } from "lucide-react";

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

const Chip: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-px text-xs font-medium text-foreground">
    {icon}
    {label}
  </span>
);

const InstallPwaDialog: React.FC<IInstallPwaDialogProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="link" className="h-auto p-0 text-muted-foreground">
            How to install?
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Install the app</DialogTitle>
          <DialogDescription>Add TabSync to your home screen for one-tap access.</DialogDescription>
        </DialogHeader>

        <section className="space-y-2">
          <h3 className="section-label">iOS · Safari</h3>
          <ol className="settings-group text-sm">
            <li className="settings-row flex-wrap gap-1.5">
              <span className="w-4 text-xs text-muted-foreground">1</span>Tap
              <Chip icon={<Share className="h-3 w-3" />} label="Share" />
            </li>
            <li className="settings-row flex-wrap gap-1.5">
              <span className="w-4 text-xs text-muted-foreground">2</span>Tap
              <Chip icon={<SquarePlus className="h-3 w-3" />} label="Add to Home Screen" />
            </li>
          </ol>
        </section>

        <section className="space-y-2">
          <h3 className="section-label">Android · Chrome</h3>
          <ol className="settings-group text-sm">
            <li className="settings-row flex-wrap gap-1.5">
              <span className="w-4 text-xs text-muted-foreground">1</span>Tap the
              <Chip icon={<EllipsisVertical className="h-3 w-3" />} label="Menu" />
              button
            </li>
            <li className="settings-row flex-wrap gap-1.5">
              <span className="w-4 text-xs text-muted-foreground">2</span>Tap
              <Chip icon={<Download className="h-3 w-3" />} label="Install app" />
            </li>
          </ol>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default InstallPwaDialog;
