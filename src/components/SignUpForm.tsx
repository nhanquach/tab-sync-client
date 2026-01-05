import React, { useState } from "react";
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
    <Card className="w-full max-w-md backdrop-blur-md bg-white/30 border-white/20 shadow-xl">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <LogoWithTabSync />
        </div>
        <CardTitle className="text-2xl text-center">Sign up for a new account</CardTitle>
        <CardDescription className="text-center">
          <b>Hi, thank you for joining us.</b>
          <br />
          We only use your account in order to save your tabs.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSignUp} className="grid gap-4">
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
          <div className="grid gap-2">
            <Label htmlFor="repeatPassword">Confirm Password</Label>
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
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-sm">
            Already have an account?{" "}
            <Link to={ROUTES.SIGN_IN} className="underline hover:text-primary">
                Sign in
            </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;
