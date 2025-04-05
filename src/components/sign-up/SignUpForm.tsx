"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";

import { signUp } from "./actions";

interface ISignUpFormProps {}

const SignUpForm: React.FC<ISignUpFormProps> = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState({ type: "error", message: "" });

  const handleSignUp = async (formData: FormData) => {
    try {
      setIsLoading(true);

      const { data, error } = await signUp(formData);

      if (error) {
        throw error;
      }

      setMessage({
        type: "success",
        message: "Thank you for signing up.",
      });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", message: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl">Sign up</p>
      <form action={handleSignUp} className="flex flex-col gap-4">
        <label className="form-control">
          <div className="label">
            <span className="label-text">Email</span>
          </div>
          <input
            type="email"
            placeholder="your@email.com"
            className="input input-bordered w-full"
            name="email"
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
        <label className="form-control">
          <div className="label">
            <span className="label-text">Repeat password</span>
          </div>
          <input
            type="password"
            className="input input-bordered w-full"
            name="repeatPassword"
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
          <Link href="/sign-in" className="link link-hover py-4">
            Already have an account?
          </Link>
        </div>

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <Loader2Icon className="animate-spin mr-2" />}
          Sign up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
