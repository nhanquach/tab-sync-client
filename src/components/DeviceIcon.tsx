import React from "react";
import { Laptop, Monitor, Smartphone } from "lucide-react";

import { cn } from "@/lib/utils";
import { isPhoneDevice } from "../utils/tabMeta";
import { deviceHue, hueStyle } from "../utils/deviceColor";

const isLaptop = (name: string) => /(laptop|macbook|book|notebook|thinkpad|surface|xps)/i.test(name || "");

const iconFor = (name: string) => (isPhoneDevice(name) ? Smartphone : isLaptop(name) ? Laptop : Monitor);

/** Plain device glyph (inherits colour). */
const DeviceIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const Icon = iconFor(name);
  return <Icon className={cn("h-4 w-4 shrink-0 text-muted-foreground", className)} aria-hidden />;
};

/** Soft tinted chip in the device's own hue, like the extension. */
export const DeviceChip: React.FC<{ name: string; className?: string; size?: "sm" | "md" }> = ({
  name,
  className,
  size = "md",
}) => {
  const Icon = iconFor(name);
  return (
    <span
      className={cn("device-chip", size === "sm" && "h-5 w-5 rounded-md", className)}
      style={hueStyle(deviceHue(name))}
      aria-hidden
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} strokeWidth={2} />
    </span>
  );
};

/** Count pill tinted with the device's hue. */
export const DevicePill: React.FC<{ name: string; children: React.ReactNode }> = ({ name, children }) => (
  <span className="device-pill" style={hueStyle(deviceHue(name))}>
    {children}
  </span>
);

export default DeviceIcon;
