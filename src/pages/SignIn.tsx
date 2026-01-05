import React, { useState } from "react";
import { Box, Container, Grid2 } from "@mui/material";
import type { AlertColor } from "@mui/material";
import { useLocation } from "react-router-dom";

import DownloadCard from "../components/CardDownload";
import AboutAccordion from "../components/AboutAccordion";
import QRCode from "../components/QRCode";
import SignInForm from "../components/SignInForm";
import { AuthError } from "@supabase/supabase-js";

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
    <Container maxWidth="xl">
      <Grid2
        container
        spacing={4}
        justifyContent={{ xs: "center", md: "space-between" }}
        alignItems="center"
      >
        <Grid2 size={{md: 8, sm: 12}}>
          <SignInForm
            message={message}
            isLoading={isLoading}
            onSignIn={onSignIn}
            onResetPassword={resetPassword}
          />
        </Grid2>
        {!isMobile && (
          <Grid2 size={{md: 4, sm: 12}} alignItems="center">
            <Box display="flex" flexDirection={"column"} alignItems="center">
              <DownloadCard />
              <QRCode width={200} height={200} text="TabSync on your phone" />
            </Box>
          </Grid2>
        )}
      </Grid2>
      <AboutAccordion />
    </Container>
  );
};

export default SignIn;
