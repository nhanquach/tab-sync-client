import React, { useState } from "react";
import type { AlertColor } from "@mui/material";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import { ROUTES } from "../routes";
import LogoWithTabSync from "./LogoWithTabSync";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="w-full max-w-md backdrop-blur-md bg-white/30 border-white/20 shadow-xl">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <LogoWithTabSync />
        </div>
        <CardTitle className="text-2xl text-center">Sign in</CardTitle>
        <CardDescription className="text-center">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-end">
             <Button
                variant="link"
                className="px-0 font-normal"
                type="button"
                onClick={handleResetPassword}
                disabled={isLoading}
              >
                Forgot password?
              </Button>
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
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-sm">
            Don't have an account?{" "}
            <Link to={ROUTES.SIGN_UP} className="underline hover:text-primary">
                Sign up
            </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
