import React from "react";
import { Monitor, Smartphone } from "lucide-react";

import { cn } from "@/lib/utils";
import { isPhoneDevice } from "../utils/tabMeta";

const DeviceIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const Icon = isPhoneDevice(name) ? Smartphone : Monitor;
  return <Icon className={cn("h-4 w-4 shrink-0 text-muted-foreground", className)} aria-hidden />;
};

export default DeviceIcon;
