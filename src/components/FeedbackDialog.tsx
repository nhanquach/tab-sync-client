import React from "react";

import { CloseTwoTone, FeedbackTwoTone } from "@mui/icons-material";
import { sendFeedback } from "../clients/supabaseClient";
import FeedbackForm from "./FeedbackForm";
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

const FeedbackDialog = () => {
  const isMobile = isMobileApp();
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
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost" // Assuming the original was effectively ghost-like in the AppBar or standard button
          className="min-w-[50px] md:min-w-0" // matching existing styling intent roughly
        >
          <FeedbackTwoTone />
          <span className="hidden md:inline ml-2">Feedback & Support</span>
        </Button>
      </DialogTrigger>

      <DialogContent className={isMobile ? "h-screen w-screen max-w-none pt-10" : "sm:max-w-[500px]"}>
        <DialogHeader className="flex flex-row items-center gap-2 mt-2 md:mt-0">
          <FeedbackTwoTone className="text-primary mr-1" />
          <DialogTitle>Your feedback fuels our fire 🔥</DialogTitle>
        </DialogHeader>

        {!isMobile && (
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
             <CloseTwoTone />
             <span className="sr-only">Close</span>
          </DialogClose>
        )}

        <div className="py-4">
          <FeedbackForm sendFeedback={onSendFeedback} />
        </div>

        <DialogFooter className={isMobile ? "mb-4" : ""}>
             <Button variant="outline" onClick={() => setOpen(false)} className={isMobile ? "w-full" : ""}>
               Close
             </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
