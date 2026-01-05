import React from "react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

export type FontSizeVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "caption"
  | "button"
  | "overline";

// Mapping MUI variants to Tailwind classes roughly
const sizeMap: Record<FontSizeVariant, string> = {
  h1: "text-5xl font-light",
  h2: "text-4xl font-light",
  h3: "text-3xl font-normal",
  h4: "text-2xl font-normal",
  h5: "text-xl font-normal",
  h6: "text-lg font-medium",
  subtitle1: "text-base font-normal",
  subtitle2: "text-sm font-medium",
  body1: "text-base font-normal",
  body2: "text-sm font-normal",
  caption: "text-xs font-normal",
  button: "text-sm font-medium uppercase",
  overline: "text-xs font-normal uppercase",
};

const LogoWithTabSync: React.FC<{ fontSizeVariant?: FontSizeVariant, className?: string }> = ({
  fontSizeVariant = "h4",
  className,
}) => {
  return (
    <div className={cn("flex gap-2 mb-2 items-center text-foreground", sizeMap[fontSizeVariant], className)}>
      <Logo />
      <span>TabSync</span>
    </div>
  );
};

export default LogoWithTabSync;
