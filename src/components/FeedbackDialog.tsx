import React from "react";

import { sendFeedback } from "../clients/supabaseClient";
import FeedbackForm from "./FeedbackForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FeedbackDialogProps {
  /** Element that opens the dialog. */
  children: React.ReactNode;
}

const FeedbackDialog = ({ children }: FeedbackDialogProps) => {
  const [open, setOpen] = React.useState(false);

  const onSendFeedback = async (title: string, description: string) => {
    await sendFeedback(title, description);
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        setOpen(false);
        resolve();
      }, 1000)
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Feedback &amp; support</DialogTitle>
          <DialogDescription>Report a bug or suggest a feature. We read every message.</DialogDescription>
        </DialogHeader>

        <FeedbackForm sendFeedback={onSendFeedback} />

        <p className="text-xs text-muted-foreground">
          Need more help?{" "}
          <a
            href="mailto:qtrongnhan+tabsync+support@gmail.com?subject=[TabSync]"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Email us
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
