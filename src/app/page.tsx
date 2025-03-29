"use client";
import Link from "next/link";
import HeroSection from "../components/hero-section/HeroSection";
import Logo from "../components/Logo";

export default function LandingPage() {
  return (
    <>
      <header className="fixed top-0 z-40 w-full backdrop-blur-2xl bg-transparent">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 m-auto px-4 bg-transparent">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="bg-primary" />
              <span className="inline-block font-bold">TabSync</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <button className="btn btn-soft btn-primary ml-2">
                <Link href="/sign-in">Go to app</Link>
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="h-screen">
        <HeroSection />
      </main>
    </>
  );
}
