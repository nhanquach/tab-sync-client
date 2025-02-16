"use client";

import React, { useState } from "react";
import Link from "next/link";

import { signIn } from "../clients";

interface ISignInFormProps {}

const SignInForm: React.FC<ISignInFormProps> = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      console.log(e);
      await signIn({ email, password });
    } catch (error) {
      console.log(error);
      setMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    console.log({ email });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl">Sign in</p>
      <form
        onSubmit={handleSignIn}
        action="none"
        className="flex flex-col gap-4"
      >
        <label className="form-control">
          <div className="label">
            <span className="label-text">Email</span>
          </div>
          <input
            type="email"
            placeholder="youremail.com"
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
        <div className="flex justify-between items-center">
          <button className="btn btn-ghost">
            <Link href={"/sign-up"}>Create a new account</Link>
          </button>
          <button className="btn btn-link" onClick={handleResetPassword}>
            <Link href={"/reset-password"}>Forgot password?</Link>
          </button>
        </div>

        {/* {!!message.text && (
          <Alert severity={message.type}>{message.text}</Alert>
        )} */}

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <span className="loading loading-spinner"></span>}
          Sign in
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
