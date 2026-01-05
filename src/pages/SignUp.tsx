import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../routes";
import DownloadCard from "../components/CardDownload";
import QRCode from "../components/QRCode";
import SignUpForm from "../components/SignUpForm";
import { isMobileApp } from "../utils/isMobile";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import LogoWithTabSync from "../components/LogoWithTabSync";

interface ISignUpProps {
  signUp: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<{ data: any; error: string }>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const SignUp: React.FC<ISignUpProps> = ({ signUp }) => {
  const isMobile = isMobileApp();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSignUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    const { error, data } = await signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error);
    }

    if (!error && data) {
      navigate(ROUTES.HOME);
    }

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
                     <h2 className="text-2xl font-bold tracking-tight text-foreground">Join TabSync today</h2>
                     <p className="text-muted-foreground">Sync your world, one tab at a time.</p>
                 </div>
            </div>

            <div className="mt-8 flex flex-col items-center space-y-6 animate-in slide-in-from-bottom-4 duration-700 delay-200">
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
        <div className="flex flex-col justify-center bg-white/30 dark:bg-black/20 backdrop-blur-sm">
             {/* Mobile Header */}
             <div className="md:hidden w-full p-8 pb-0 bg-gradient-to-b from-primary/10 to-transparent flex flex-col items-center text-center space-y-2 rounded-t-xl">
                 <LogoWithTabSync className="mb-0 scale-110" />
                 <p className="text-sm font-medium text-muted-foreground">Join TabSync today</p>
            </div>

             <div className="p-8 md:p-12 pt-6 md:pt-12">
                <SignUpForm
                    isLoading={isLoading}
                    message={message}
                    onSignUp={onSignUp}
                />
             </div>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
