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
          // MD3 Styling Replacement with Asymmetric Quacky Shape
          "bg-md-sys-color-surface-container-high text-md-sys-color-on-surface border-none",
          isMobile
            ? "h-screen w-screen max-w-none pt-10 rounded-none overflow-y-auto"
            : "max-h-[85vh] overflow-y-auto sm:max-w-5xl p-0 rounded-tl-[32px] rounded-br-[32px] rounded-tr-[16px] rounded-bl-[16px] md:rounded-tl-[64px] md:rounded-br-[64px] md:rounded-tr-[24px] md:rounded-bl-[24px]"
        )}
      >
        <div className={cn(
          "flex flex-col md:flex-row md:min-h-[600px]",
          // Remove h-full on mobile to allow growing
          "h-auto md:h-full"
        )}>
          {/* Left Column (Hero) - Quacky Expressive Style */}
          <div className="flex-1 p-6 md:p-10 bg-md-sys-color-tertiary-container text-md-sys-color-on-tertiary-container flex flex-col justify-center items-start space-y-6 md:space-y-8 relative overflow-hidden shrink-0">

            {/* Decorative background blob */}
            <div className="absolute -right-20 -top-20 w-40 h-40 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="flex items-center gap-2 transform -rotate-12 transition-transform hover:rotate-0 duration-500 origin-bottom-left">
              {/* Force large font size using Tailwind !text classes which override MUI styles */}
              <HandshakeOutlined className="!text-6xl md:!text-8xl opacity-80" />
            </div>

            <div className="space-y-2 md:space-y-4 z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                Hi there <span className="inline-block hover:animate-bounce">🦆</span>
              </h2>
              <p className="text-lg md:text-xl font-medium opacity-90 max-w-sm">
                Your feedback fuels our fire <span className="text-xl md:text-2xl">🔥</span>
              </p>
            </div>

            <div className="opacity-80 text-base md:text-lg font-medium">
              <p>Thank you for trying out!</p>
              <p>We'd love to hear from you.</p>
            </div>

            <div className="pt-4 md:pt-8">
              <p className="text-sm opacity-80">
                Need more help?&nbsp;
                <a
                  href="mailto:qtrongnhan+tabsync+support@gmail.com?subject=[TabSync]"
                  className="hover:underline font-bold"
                >
                  Contact us via email
                </a>
              </p>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative bg-transparent shrink-0">
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
