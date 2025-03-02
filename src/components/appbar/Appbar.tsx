"use client";

import {
  Bookmark,
  Grid3X3,
  Home,
  Plus,
  Settings,
  User,
  Laptop,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signout } from "./actions";

import Logo from "../Logo";
import { useState } from "react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Links",
    href: "/links",
    icon: Bookmark,
  },
  {
    title: "Devices",
    href: "/devices",
    icon: Laptop,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: Grid3X3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

type IUser = {
  email: string;
};

const Appbar = ({ user }: { user: IUser }) => {
  const [loading, setLoading] = useState(false);

  const handleSignout = async () => {
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
    <div className="border-r bg-muted/40 block h-screen backdrop-blur-2xl">
      <div className="flex h-full w-[240px] flex-col px-4 py-8">
        <h2 className="mb-6 px-2 text-lg font-semibold tracking-tight flex gap-2">
          <Logo />
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
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <div className="dropdown dropdown-top">
            <button className="btn btn-ghost w-full cursor-pointer rounded-sm overflow-ellipsis">
              <User className="scale-[2]" />
              {user.email}
            </button>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
            >
              <li>
                <a className="text-blue-300">Give Feedback</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <button onClick={handleSignout}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                  Sign out
                </button>
              </li>
            </ul>
          </div>
          <Link href="/dashboard/links/new">
            <button className="btn btn-outline rounded-sm w-full flex items-center gap-2">
              <Plus className="mr-2 h-4 w-4" />
              Add New Link
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Appbar;

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Menu, Search, X } from "lucide-react";

// import Logo from "@components/Logo";

// import { signout } from "./actions";

// type IUser = {
//   email: string;
// };

// export default function AppBar({ user }: { user: IUser }) {
//   const userShortName = user?.email?.split("@")?.[0].charAt(0).toUpperCase();

//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const handleSignout = async () => {
//     await signout();
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:border-gray-800">
//       <div className="container mx-auto px-4">
//         <div className="flex h-14 items-center justify-between gap-4">
//           {/* Logo Section */}
//           <div className="flex items-center gap-2">
//             <Logo />
//             <span className="hidden font-bold sm:inline-block text-xl">
//               TabSync
//             </span>
//           </div>

//           {/* Navigation - Desktop */}
//           <nav className="hidden md:flex items-center space-x-2 flex-1">
//             <Link
//               href="/dashboard"
//               className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
//             >
//               Home
//             </Link>
//             <Link
//               href="/devices"
//               className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
//             >
//               Devices
//             </Link>
//             <Link
//               href="/history"
//               className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
//             >
//               History
//             </Link>
//           </nav>

//           {/* Right Section */}
//           <div className="flex items-center gap-2">
//             {/* Search bar */}
//             <label className="input">
//               <Search />
//               <input type="search" className="grow" placeholder="Search" />
//               <kbd className="kbd kbd-sm">⌘</kbd>
//               <kbd className="kbd kbd-sm">K</kbd>
//             </label>
//             {/* Account settings */}

//             <div className="dropdown dropdown-end">
//               <button className="avatar avatar-placeholder cursor-pointer">
//                 <div className="bg-neutral text-neutral-content w-10 rounded-full">
//                   <span>{userShortName}</span>
//                 </div>
//               </button>
//               <ul
//                 tabIndex={0}
//                 className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
//               >
//                 <li>
//                   <a>Settings</a>
//                 </li>
//                 <li>
//                   <a onClick={handleSignout}>Sign out</a>
//                 </li>
//               </ul>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="md:hidden p-2 text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
//               aria-label="Toggle menu"
//             >
//               {isMenuOpen ? (
//                 <X className="h-5 w-5" />
//               ) : (
//                 <Menu className="h-5 w-5" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <nav className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800">
//             <div className="space-y-2">
//               <Link
//                 href="/dashboard"
//                 className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
//               >
//                 Dashboard
//               </Link>
//               <Link
//                 href="/devices"
//                 className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
//               >
//                 Devices
//               </Link>
//               <Link
//                 href="/history"
//                 className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
//               >
//                 History
//               </Link>
//             </div>
//           </nav>
//         )}
//       </div>
//     </header>
//   );
// }
