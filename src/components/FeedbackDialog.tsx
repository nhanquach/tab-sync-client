import React from "react";

import { FeedbackTwoTone, HandshakeOutlined } from "@mui/icons-material";
import { sendFeedback } from "../clients/supabaseClient";
import FeedbackForm from "./FeedbackForm";
import { isMobileApp } from "../utils/isMobile";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeedbackDialogProps {
  iconOnly?: boolean;
}

const FeedbackDialog = ({ iconOnly }: FeedbackDialogProps) => {
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
          variant="ghost"
          className="min-w-[50px] md:min-w-0"
        >
          <FeedbackTwoTone />
          <span className={cn("ml-2", iconOnly ? "hidden" : "hidden md:inline")}>Feedback & Support</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "shadow-xl",
          // MD3 Styling Replacement
          "bg-md-sys-color-surface-container-high text-md-sys-color-on-surface border-none",
          isMobile
            ? "h-screen w-screen max-w-none pt-10 rounded-none"
            : "sm:max-w-5xl p-0 overflow-hidden rounded-[28px]"
        )}
      >
        <div className="flex flex-col md:flex-row h-full md:min-h-[600px]">
          {/* Left Column (Hero) */}
          <div className="flex-1 p-6 md:p-10 bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container flex flex-col justify-center items-start space-y-6">
            <div className="flex items-center gap-2">
              <HandshakeOutlined className="text-5xl" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Hi there 🙌🏼</h2>
              <p className="text-lg opacity-80">
                Your feedback fuels our fire 🔥
              </p>
            </div>

            <div className="opacity-80">
              <p>Thank you for trying out!</p>
              <p>We'd love to hear from you. All feedback is welcome!</p>
            </div>

            <div className="pt-4">
              <p className="text-sm opacity-80">
                Need more help?&nbsp;
                <a
                  href="mailto:qtrongnhan+tabsync+support@gmail.com?subject=[TabSync]"
                  className="hover:underline font-medium font-bold"
                >
                  Contact us via email
                </a>
              </p>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative bg-transparent">
            {/* Custom Close button removed to avoid duplicates with the default DialogContent close button */}

            <FeedbackForm sendFeedback={onSendFeedback} />

            {isMobile && (
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
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

export default FeedbackDialog;
