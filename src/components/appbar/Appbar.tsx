"use client";

import {
  Bookmark,
  Grid3X3,
  Home,
  Settings,
  Loader2,
  UserIcon,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getUser, signout } from "./actions";

import Logo from "../Logo";
import { useEffect, useState } from "react";
import { IUser } from "../../interfaces/IUser";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Search",
    href: "/advance-search",
    icon: Search,
    beta: true,
  },
  {
    title: "Links",
    href: "/links",
    icon: Bookmark,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: Grid3X3,
    beta: true,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const Appbar = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUser().then(({ data }) => {
      setUser(data.user as IUser);
    });
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signout();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pathname = usePathname();

  return (
    <div className="h-screen backdrop-blur-md md:bg-base-200 border-r border-primary md:border-none">
      <div className="flex h-full w-[240px] flex-col px-4 py-8">
        <h2 className="mb-6 px-2 text-lg font-semibold tracking-tight flex gap-2">
          <Logo className="bg-neutral" />
          TabSync
        </h2>
        <div className="space-y-1">
          <ul className="menu rounded-box w-full">
            {navItems.map((item) => (
              <li
                key={item.href}
                className={pathname === item.href ? "py-2" : "py-2 opacity-60"}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                  {item.beta && (
                    <span className="badge badge-ghost badge-sm opacity-60">
                      Beta
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <div className="dropdown dropdown-top">
            <button className="btn btn-ghost w-full cursor-pointer rounded-sm overflow-ellipsis">
              <UserIcon className="mr-2" />
              {user?.user_metadata?.name || user?.email?.split("@")[0]}
            </button>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
            >
              <li>
                <a className="text-blue-300">Give Feedback</a>
              </li>
              <li>
                <Link href="/settings">Settings</Link>
              </li>
              <li>
                <button onClick={handleSignOut}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appbar;
