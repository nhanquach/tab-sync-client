import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

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
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
         <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create an account</h1>
         <p className="text-sm text-muted-foreground">
            <b>Hi, thank you for joining us.</b>
            <br />
            We only use your account in order to save your tabs.
         </p>
      </div>

      <form onSubmit={handleSignUp} className="grid gap-4">
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
              className="text-foreground bg-background"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="text-foreground bg-background"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="repeatPassword" className="text-foreground">Confirm Password</Label>
            <Input
              id="repeatPassword"
              type="password"
              value={repeatPassword}
              onChange={(e) => {
                if (passwordsMatch) setPasswordsMatch(false);
                setRepeatPassword(e.target.value);
              }}
              required
              disabled={isLoading}
              className="text-foreground bg-background"
            />
          </div>

          {passwordsMatch && (
             <div className="p-3 text-sm rounded-md bg-destructive/15 text-destructive">
                Passwords do not match
             </div>
          )}
          {!!message && (
             <div className="p-3 text-sm rounded-md bg-destructive/15 text-destructive">
                {message}
             </div>
          )}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Sign Up"
            )}
          </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to={ROUTES.SIGN_IN} className="underline hover:text-primary underline-offset-4">
                Sign in
            </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
