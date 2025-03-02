"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";

import { signIn, resetPassword } from "./actions";

interface ISignInFormProps {}

const STATUS = {
  idle: "idle",
  signIn: "signIn",
  resetPassword: "resetPassword",
};

const SignInForm: React.FC<ISignInFormProps> = () => {
  const [status, setStatus] = useState(STATUS.idle);

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const handleSignIn = async (formData: FormData) => {
    setStatus(STATUS.signIn);

    try {
      const { error } = await signIn(formData);

      if (error) {
        throw error;
      }
    } catch (error) {
      if ((error as Error).message === "NEXT_REDIRECT") {
        return;
      }

      console.error(error as Error);
      setMessage((error as Error).message);
    } finally {
      setTimeout(() => {
        setStatus(STATUS.idle);
      }, 1000);
    }
  };

  const handleResetPassword = async () => {
    setStatus(STATUS.resetPassword);
    setMessage("");

    try {
      const { error } = await resetPassword(email);

      if (error) {
        throw error;
      }
      setMessage("Please check your email for a link to reset your password");
    } catch (error) {
      console.error(error);
      setMessage((error as Error).message);
    } finally {
      setTimeout(() => {
        setStatus(STATUS.idle);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl">Sign in</p>
      <form action={handleSignIn} className="flex flex-col gap-4">
        <label className="form-control">
          <div className="label">
            <span className="label-text">Email</span>
          </div>
          <input
            type="email"
            placeholder="your@email.com"
            className="input input-bordered w-full"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="form-control">
          <div className="label">
            <span className="label-text">Password</span>
          </div>
          <input
            type="password"
            className="input input-bordered w-full"
            name="password"
          />
        </label>

        {message && <p className="text-red-500">{message}</p>}

        <div className="flex">
          <button
            className="link link-hover py-4"
            type="button"
            onClick={handleResetPassword}
            disabled={status === STATUS.resetPassword}
          >
            {status === STATUS.resetPassword && (
              <span className="loading loading-spinner" />
            )}
            Forgot password?
          </button>
        </div>

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={status === STATUS.signIn}
        >
          {status === STATUS.signIn && (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Sign in
        </button>
      </form>

      <button className="btn btn-ghost">
        <Link href={"/sign-up"}>Create a new account</Link>
      </button>
    </div>
  );
};

export default SignInForm;
