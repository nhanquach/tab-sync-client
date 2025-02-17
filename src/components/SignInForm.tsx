"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { getUser, resetPassword, signIn } from "@clients/index";

interface ISignInFormProps {}

const STATUS = {
  idle: "idle",
  signingIn: "signingIn",
  resettingPassword: "resettingPassword",
};

const SignInForm: React.FC<ISignInFormProps> = () => {
  const [status, setStatus] = useState(STATUS.idle);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter your email and password");
      return;
    }

    try {
      setStatus(STATUS.signingIn);
      await signIn({ email, password });
    } catch (error) {
      console.error(error);
      setMessage((error as Error).message);
    } finally {
      setStatus(STATUS.idle);
    }
  };

  const handleResetPassword = async () => {
    try {
      setStatus(STATUS.resettingPassword);

      if (!email) {
        setMessage("Please enter your email");
        return;
      }

      setMessage("");
      const { error } = await resetPassword({ email });

      if (error) {
        throw error;
      }

      setMessage("Please check your email for a link to reset your password");
    } catch (error) {
      console.error(error);
      setMessage((error as Error).message);
    } finally {
      setStatus(STATUS.idle);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser();

        if (user) {
          window.location.href = "/home";
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl">Sign in</p>
      <form onSubmit={handleSignIn} className="flex flex-col gap-4">
        <label className="form-control">
          <div className="label">
            <span className="label-text">Email</span>
          </div>
          <input
            type="email"
            placeholder="your@email.com"
            className="input input-bordered w-full"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {message && <p className="text-red-500">{message}</p>}

        <div className="flex">
          <button
            className="link link-hover py-4"
            type="button"
            onClick={handleResetPassword}
            disabled={status === STATUS.resettingPassword}
          >
            {status === STATUS.resettingPassword && (
              <span className="loading loading-spinner" />
            )}
            Forgot password?
          </button>
        </div>

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={status === STATUS.signingIn}
        >
          {status === STATUS.signingIn && (
            <span className="loading loading-spinner" />
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
