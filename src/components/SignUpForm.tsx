import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { ROUTES } from "../routes";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ISignUpFormProps {
  isLoading: boolean;
  message: string;
  onSignUp: ({ email, password }: { email: string; password: string }) => void;
}

const SignUpForm: React.FC<ISignUpFormProps> = ({
  isLoading,
  message,
  onSignUp,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setPasswordsMatch(true);
      return;
    }

    setPasswordsMatch(false);
    onSignUp({ email, password });
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-col space-y-1">
         <h1 className="text-lg font-semibold text-foreground">Create an account</h1>
         <p className="text-sm text-muted-foreground">
            We only use your account to save your tabs.
         </p>
      </div>

      <form onSubmit={handleSignUp} className="grid gap-3">
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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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
          <div className="grid gap-1.5">
            <Label htmlFor="repeatPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="repeatPassword"
                type={showRepeatPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={repeatPassword}
                onChange={(e) => {
                  if (passwordsMatch) setPasswordsMatch(false);
                  setRepeatPassword(e.target.value);
                }}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10 hover:bg-transparent text-muted-foreground hover:text-foreground rounded-r-md rounded-l-none"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                aria-label={showRepeatPassword ? "Hide password" : "Show password"}
              >
                {showRepeatPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {passwordsMatch && (
             <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                Passwords do not match
             </div>
          )}
          {!!message && (
             <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {message}
             </div>
          )}

            <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-label="Loading" />
            ) : (
              "Sign up"
            )}
          </Button>
      </form>

      <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to={ROUTES.SIGN_IN} className="font-medium text-foreground underline-offset-4 hover:underline">
                Sign in
            </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
