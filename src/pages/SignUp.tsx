import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../routes";
import SignUpForm from "../components/SignUpForm";
import AuthLayout from "../components/AuthLayout";
import { isMobileApp } from "../utils/isMobile";

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
    <AuthLayout isMobile={isMobile}>
      <SignUpForm isLoading={isLoading} message={message} onSignUp={onSignUp} />
    </AuthLayout>
  );
};

export default SignUp;
