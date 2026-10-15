import React, { useState } from "react";
import type { AlertColor } from "@mui/material";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
    <div className="w-full space-y-5">
      <div className="flex flex-col space-y-1">
        <h1 className="text-lg font-semibold text-foreground">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Use the same account as the TabSync extension.
        </p>
      </div>

      <form onSubmit={handleSignIn} className="grid gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            
          />
        </div>
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
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
              className="pr-10"
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
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {!!message.text && (
          <div
            className={`rounded-md px-3 py-2 text-sm ${
              message.type === "error"
                ? "border border-destructive/30 bg-destructive/5 text-destructive"
                : "border border-primary/30 bg-primary/5 text-foreground"
            }`}
          >
            {message.text}
          </div>
        )}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-label="Loading" />
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to={ROUTES.SIGN_UP} className="font-medium text-foreground underline-offset-4 hover:underline">
              Sign up
          </Link>
      </div>
    </div>
  );
};

export default SignInForm;
