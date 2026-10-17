import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import type { AlertColor } from "@mui/material";

import { AuthError } from "@supabase/supabase-js";

import SignInForm from "../components/SignInForm";
import AuthLayout from "../components/AuthLayout";

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
    <AuthLayout isMobile={isMobile}>
      <SignInForm
        message={message}
        isLoading={isLoading}
        onSignIn={onSignIn}
        onResetPassword={resetPassword}
      />
    </AuthLayout>
  );
};

export default SignIn;
