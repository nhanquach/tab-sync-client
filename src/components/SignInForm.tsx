import React, { useState } from "react";
import type { AlertColor } from "@mui/material";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
  const [showPassword, setShowPassword] = useState(false);

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
        {/* MD3 Expressive: Bolder typography */}
        <h1 className="text-3xl font-black tracking-tighter text-foreground">Sign in</h1>
        <p className="text-sm text-muted-foreground font-medium">
          Enter your email below to login to your account
        </p>
      </div>

      <form onSubmit={handleSignIn} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="text-foreground bg-background/50 backdrop-blur-sm"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-foreground">Password</Label>
             <Button
                variant="link"
                className="px-0 font-normal h-auto text-xs text-primary"
                type="button"
                onClick={handleResetPassword}
                disabled={isLoading}
              >
                Forgot password?
              </Button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="text-foreground bg-background/50 backdrop-blur-sm pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full w-10 hover:bg-transparent text-muted-foreground hover:text-foreground rounded-r-md rounded-l-none"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <VisibilityOff className="h-4 w-4" />
              ) : (
                <Visibility className="h-4 w-4" />
              )}
            </Button>
          </div>
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

        {/* MD3 Expressive: Pill shaped button */}
        <Button className="w-full rounded-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to={ROUTES.SIGN_UP} className="underline hover:text-primary underline-offset-4 font-semibold">
              Sign up
          </Link>
      </div>
    </div>
  );
};

export default SignInForm;
