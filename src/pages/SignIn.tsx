import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import type { AlertColor } from "@mui/material";

import DownloadCard from "../components/CardDownload";
import QRCode from "../components/QRCode";
import SignInForm from "../components/SignInForm";
import LogoWithTabSync from "../components/LogoWithTabSync";
import InstallPwaDialog from "../components/InstallPwaDialog";
import { AuthError } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InfoOutlined } from "@mui/icons-material";

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
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full p-4 md:p-10 animate-in fade-in duration-700">
      <Card className={cn(
          "w-full max-w-5xl overflow-hidden rounded-xl shadow-2xl transition-all duration-300",
          // Light mode: White glass
          "backdrop-blur-xl bg-white/40 border border-white/40",
          // Dark mode: Dark glass
          "dark:bg-black/40 dark:border-white/10",
          "grid grid-cols-1 md:grid-cols-2"
      )}>
        {/* Left Panel: Visuals & Download */}
        <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-primary/10 to-transparent border-r border-white/20 dark:border-white/10">
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-700 delay-100">
                 <LogoWithTabSync />
                 <div className="space-y-2">
                     <h2 className="text-2xl font-bold tracking-tight text-foreground">Sync your tabs across devices</h2>
                     <p className="text-muted-foreground">Seamlessly access your open tabs on any device, anywhere.</p>
                 </div>
            </div>

            <div className="mt-8 flex flex-col items-center space-y-6 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                {!isMobile && (
                    <>
                        <div className="transform scale-90 origin-bottom flex flex-col items-center gap-2">
                            <QRCode width={180} height={180} text="Scan to access on mobile" />
                            <InstallPwaDialog>
                                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground h-auto p-1 gap-1">
                                    <InfoOutlined fontSize="inherit" /> How to install app?
                                </Button>
                            </InstallPwaDialog>
                        </div>
                        <div className="w-full max-w-xs opacity-90">
                           <DownloadCard small />
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* Right Panel: Form */}
        <div className="flex flex-col justify-center bg-white/30 dark:bg-black/20 backdrop-blur-sm">
            {/* Mobile Header */}
            <div className="md:hidden w-full p-8 pb-0 bg-gradient-to-b from-primary/10 to-transparent flex flex-col items-center text-center space-y-2 rounded-t-xl">
                 <LogoWithTabSync className="mb-0 scale-110" />
                 <p className="text-sm font-medium text-muted-foreground">Sync your tabs across devices</p>
                 <InstallPwaDialog>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1 rounded-full border-primary/20 bg-background/50">
                         <InfoOutlined fontSize="inherit" /> Install App
                    </Button>
                </InstallPwaDialog>
            </div>

            <div className="p-8 md:p-12 pt-6 md:pt-12">
                <SignInForm
                    message={message}
                    isLoading={isLoading}
                    onSignIn={onSignIn}
                    onResetPassword={resetPassword}
                />
            </div>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
