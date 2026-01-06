import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { headerHeight } from "./HomeAppBar";
import { LaptopMacTwoTone, PhoneIphoneTwoTone, DevicesOtherTwoTone, AppsTwoTone } from "@mui/icons-material";

interface IDeviceTabsProps {
  browsers: string[];
  selectedDevice: string;
  onSelect: (device: string) => void;
}

const DeviceTabs: React.FC<IDeviceTabsProps> = ({ browsers, selectedDevice, onSelect }) => {
  // Helper to guess icon based on name (optional polish)
  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower === "all") return <AppsTwoTone className="mr-2 h-4 w-4" />;
    if (lower.includes("mac") || lower.includes("windows") || lower.includes("laptop"))
      return <LaptopMacTwoTone className="mr-2 h-4 w-4" />;
    if (lower.includes("iphone") || lower.includes("android") || lower.includes("mobile"))
      return <PhoneIphoneTwoTone className="mr-2 h-4 w-4" />;
    return <DevicesOtherTwoTone className="mr-2 h-4 w-4" />;
  };

  const tabs = ["All", ...browsers];

  return (
    <div
      className={cn(
        "sticky z-30 w-full py-2 mb-4",
        "bg-background/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10",
        // Top value needs to account for the fixed header.
        // headerHeight is a number (64), so we need to convert to px string or use style.
        // Tailwind class `top-16` is 4rem = 64px, assuming headerHeight is 64.
        "top-16"
      )}
      style={{ top: headerHeight }}
    >
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1 pb-1">
        {tabs.map((device) => {
          const isActive = selectedDevice === device;
          return (
            <Button
              key={device}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onSelect(device)}
              className={cn(
                "rounded-full transition-all duration-300 whitespace-nowrap",
                isActive
                  ? "shadow-md scale-105"
                  : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {getIcon(device === "All" ? "all" : device)}
              {device}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceTabs;
