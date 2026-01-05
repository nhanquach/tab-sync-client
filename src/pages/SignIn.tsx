import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import type { AlertColor } from "@mui/material";

import DownloadCard from "../components/CardDownload";
import QRCode from "../components/QRCode";
import SignInForm from "../components/SignInForm";
import LogoWithTabSync from "../components/LogoWithTabSync";
import { AuthError } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ISignInProps {
  signIn: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<{ error: string }>;
  onResetPassword: ({ email }: { email: string }) => Promise<
    | {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        data: {};
        error: null;
      }
    | {
        data: null;
        error: AuthError;
      }
  >;
}

const SignIn: React.FC<ISignInProps> = ({
  signIn,
  onResetPassword,
}) => {
  const location = useLocation();
  const isMobile = location.pathname === "/mobileapp";
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState<{ type: AlertColor; text: string }>({
    type: "error",
    text: "",
  });

  const onSignIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    const { error } = await signIn({
      email,
      password,
    });

    if (error) {
      setMessage({ type: "error", text: error });
    }

    setIsLoading(false);
  };

  const resetPassword = async ({ email }: { email: string }) => {
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email" });
      return;
    }

    setMessage({ type: message.type, text: "" });
    setIsLoading(true);

    await onResetPassword({ email });
    setMessage({
      type: "info",
      text: "Check your email for a link to reset your password",
    });
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full p-4 md:p-10">
      <Card className={cn(
          "w-full max-w-5xl overflow-hidden rounded-xl shadow-2xl",
          "backdrop-blur-xl bg-white/40 border border-white/40",
          "grid grid-cols-1 md:grid-cols-2"
      )}>
        {/* Left Panel: Visuals & Download */}
        <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-primary/10 to-transparent border-r border-white/20">
            <div className="space-y-6">
                 <LogoWithTabSync />
                 <div className="space-y-2">
                     <h2 className="text-2xl font-bold tracking-tight">Sync your tabs across devices</h2>
                     <p className="text-muted-foreground">Seamlessly access your open tabs on any device, anywhere.</p>
                 </div>
            </div>

            <div className="mt-8 flex flex-col items-center space-y-6">
                {!isMobile && (
                    <>
                        <div className="transform scale-90 origin-bottom">
                            <QRCode width={180} height={180} text="Scan to get the mobile app" />
                        </div>
                        <div className="w-full max-w-xs opacity-90">
                           <DownloadCard small />
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* Right Panel: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white/30 backdrop-blur-sm">
            {/* Mobile Header */}
            <div className="md:hidden flex flex-col items-center mb-6 space-y-2">
                 <LogoWithTabSync />
                 <h2 className="text-xl font-bold text-center">TabSync</h2>
            </div>

            <SignInForm
                message={message}
                isLoading={isLoading}
                onSignIn={onSignIn}
                onResetPassword={resetPassword}
            />
        </div>
      </Card>
      {/* AboutAccordion removed as requested */}
    </div>
  );
};

export default SignIn;
