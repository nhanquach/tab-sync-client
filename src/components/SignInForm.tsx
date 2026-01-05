import React, { useState } from "react";
import type { AlertColor } from "@mui/material";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import { ROUTES } from "../routes";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ISignInFormProps {
  isLoading: boolean;
  message: { type: AlertColor; text: string };
  onSignIn: ({ email, password }: { email: string; password: string }) => void;
  onResetPassword: ({ email }: { email: string }) => void;
}

const SignInForm: React.FC<ISignInFormProps> = ({
  isLoading,
  message,
  onSignIn,
  onResetPassword,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn({ email, password });
  };

  const handleResetPassword = () => {
    onResetPassword({ email });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        {/* Logo is handled in the parent layout for the unified look, or we can keep it here.
            Let's keep it here for the "Right Pane" header. */}
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <form onSubmit={handleSignIn} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
             <Button
                variant="link"
                className="px-0 font-normal h-auto text-xs"
                type="button"
                onClick={handleResetPassword}
                disabled={isLoading}
              >
                Forgot password?
              </Button>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {!!message.text && (
          <div
            className={`p-3 text-sm rounded-md ${
              message.type === "error"
                ? "bg-destructive/15 text-destructive"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to={ROUTES.SIGN_UP} className="underline hover:text-primary underline-offset-4">
              Sign up
          </Link>
      </div>
    </div>
  );
};

export default SignInForm;
