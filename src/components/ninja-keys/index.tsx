"use client";

import { useRef, useState, useEffect, useContext, useCallback } from "react";

import { useRouter, usePathname } from "next/navigation";

import "ninja-keys";
import NinjaKeysContext from "./context";
import { ITab } from "../../interfaces/Tab";
import { HomeIC } from "./icons";

const excludePaths = ["/", "/sign-in", "/sign-up", "/forgot-password"];

const NinjaKeys = () => {
  const router = useRouter();
  const pathname = usePathname();
  const ninjaKeys = useRef(null);

  const context = useContext(NinjaKeysContext);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window) {
      setIsDarkMode(window?.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  const [hotkeys] = useState([
    {
      id: "Dashboard",
      title: "Open Dashboard",
      section: "Navigation",
      icon: HomeIC,
      handler: () => {
        router.push("/dashboard");
      },
    },
    {
      id: "Open Your Tabs",
      title: "Open Links",
      section: "Navigation",
      handler: () => {
        router.push("/links");
      },
    },
    {
      id: "Open Settings",
      title: "Open Settings",
      section: "Navigation",
      handler: () => {
        router.push("/settings");
      },
    },
    {
      id: "Open Search",
      title: "Open Search",
      section: "Navigation",
      handler: () => {
        router.push("/advance-search");
      },
    },
    {
      id: "Open Categories",
      title: "Open Categories",
      section: "Navigation",
      handler: () => {
        router.push("/advance-categories");
      },
    },
  ]);

  const buildLinkListToHotKeys = useCallback((linkList?: ITab[]) => {
    if (!linkList) {
      return [];
    }

    return linkList.map((link) => {
      return {
        id: link.title,
        title: link.title,
        section: "Your tab",
        handler: () => {
          router.push(link.url);
        },
      };
    });
  }, [router]);

  useEffect(() => {
    if (ninjaKeys.current) {
      (ninjaKeys.current as any).data = [
        ...hotkeys,
        ...buildLinkListToHotKeys(context?.linkList),
      ];
    }
  }, [pathname, hotkeys, context?.linkList, buildLinkListToHotKeys]);

  if (excludePaths.includes(pathname)) {
    return null;
  }

  return (
    <>
      {/* @ts-ignore */}
      <ninja-keys
        ref={ninjaKeys}
        class={isDarkMode ? "dark" : "light"}
        hideBreadcrumbs
      />
    </>
  );
};
export default NinjaKeys;
