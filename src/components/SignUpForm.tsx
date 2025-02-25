"use client";

import React, { useState } from "react";
import Link from "next/link";

import { signUp } from "@client";

interface ISignInFormProps {}

const SignInForm: React.FC<ISignInFormProps> = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [message, setMessage] = useState({ type: "error", message: "" });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !repeatPassword) {
      setMessage({
        type: "error",
        message: "Please enter your email and password",
      });
      return;
    }

    if (password !== repeatPassword) {
      setMessage({ type: "error", message: "Passwords do not match" });
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await signUp({ email, password });

      if (error) {
        throw error;
      }

      setMessage({
        type: "success",
        message: "Thank you for signing up.",
      });
    } catch (error) {
      console.log(error);
      setMessage({ type: "error", message: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl">Sign up</p>
      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
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
        <label className="form-control">
          <div className="label">
            <span className="label-text">Repeat password</span>
          </div>
          <input
            type="password"
            className="input input-bordered w-full"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </label>

        {message.message && message.type === "error" && (
          <p className="text-red-500">{message.message}</p>
        )}
        {message.message && message.type === "success" && (
          <p className="text-green-500">
            {message.message}
            <Link href="/" className="link link-hover ml-2">
              Please sign in to continue.
            </Link>
          </p>
        )}

        <div className="flex justify-end items-center">
          <Link href="/" className="link link-hover py-4">
            Already have an account?
          </Link>
        </div>

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <span className="loading loading-spinner"></span>}
          Sign up
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
