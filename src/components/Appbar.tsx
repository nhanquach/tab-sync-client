"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import Logo from "./Logo";

type IUser = {
  email: string;
};

export default function AppBar({ user }: { user: IUser }) {
  const userShortName = user?.email?.split("@")?.[0].charAt(0).toUpperCase();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Logo />
            <span className="hidden font-bold sm:inline-block text-xl">
              TabSync
            </span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-2 flex-1">
            <Link
              href="/dashboard"
              className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Home
            </Link>
            <Link
              href="/devices"
              className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Devices
            </Link>
            <Link
              href="/history"
              className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
            >
              History
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search bar */}
            <label className="input">
              <Search />
              <input type="search" className="grow" placeholder="Search" />
              <kbd className="kbd kbd-sm">⌘</kbd>
              <kbd className="kbd kbd-sm">K</kbd>
            </label>
            {/* Account settings */}
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-10 rounded-full">
                <span>{userShortName}</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800">
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Dashboard
              </Link>
              <Link
                href="/devices"
                className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Devices
              </Link>
              <Link
                href="/history"
                className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
              >
                History
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
