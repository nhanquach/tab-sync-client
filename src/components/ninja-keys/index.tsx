"use client";

import { useRef, useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import "ninja-keys";

const NinjaKeys = () => {
  const router = useRouter();
  const ninjaKeys = useRef(null);

  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [hotkeys, setHotkeys] = useState([
    {
      id: "Dashboard",
      title: "Open Dashboard",
      section: "Navigation",
      handler: () => {
        router.push("/dashboard");
      },
    },
    {
      id: "Open Your Tabs",
      title: "Open Your Tabs",
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
    {
      id: "Your tab",
      title: "Google",
      section: "Your tab",
      handler: () => {
        router.push("https://google.com");
      },
    },
  ]);

  useEffect(() => {
    if (ninjaKeys.current) {
      ninjaKeys.current.data = hotkeys;
    }
  }, []);

  return (
    <>
      <ninja-keys
        ref={ninjaKeys}
        class={isDarkMode ? "dark" : "light"}
        hideBreadcrumbs
      />
    </>
  );
};
export default NinjaKeys;
