"use client";

import React, { useState } from "react";
import Link from "next/link";

import { login, resetPassword } from "./login";

interface ILogInFormProps {}

const STATUS = {
  idle: "idle",
  signingIn: "signingIn",
  resettingPassword: "resettingPassword",
};

const LogInForm: React.FC<ILogInFormProps> = () => {
  const [status, setStatus] = useState(STATUS.idle);

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const handleSignIn = async (formData: FormData) => {
    try {
      setStatus(STATUS.signingIn);
      const { error } = await login(formData);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error as Error);
      setMessage((error as Error).message);
    } finally {
      setStatus(STATUS.idle);
    }
  };

  const handleResetPassword = async () => {
    try {
      setStatus(STATUS.resettingPassword);
      setMessage("");

      const { error } = await resetPassword(email);
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

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl">Log in</p>
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

export default LogInForm;
