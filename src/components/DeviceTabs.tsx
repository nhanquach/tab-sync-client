import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { headerHeight } from "./HomeAppBar";
import { LaptopMacTwoTone, PhoneIphoneTwoTone, DevicesOtherTwoTone, AppsTwoTone } from "@mui/icons-material";

interface IDeviceTabsProps {
  devices: string[];
  selectedDevice: string;
  onSelectDevice: (device: string) => void;
}

const DeviceTabs: React.FC<IDeviceTabsProps> = ({ devices, selectedDevice, onSelectDevice }) => {
  // Helper to guess icon based on name (optional polish)
  const getIcon = (name: string, isActive: boolean) => {
    const className = cn("mr-2 h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground");

    const lower = name.toLowerCase();
    if (lower === "all") return <AppsTwoTone className={className} />;
    if (lower.includes("mac") || lower.includes("windows") || lower.includes("laptop"))
      return <LaptopMacTwoTone className={className} />;
    if (lower.includes("iphone") || lower.includes("android") || lower.includes("mobile"))
      return <PhoneIphoneTwoTone className={className} />;
    return <DevicesOtherTwoTone className={className} />;
  };

  const tabs = ["All", ...devices];

  return (
    <div
      className={cn(
        "sticky z-30 w-full py-3 mb-6 -mx-6 px-6", // Use tailwind classes instead of hardcoded style
        "backdrop-blur-xl bg-white/30 dark:bg-black/30",
        "border-b border-white/20 dark:border-white/5",
        "flex items-center"
      )}
      style={{
        top: headerHeight,
        width: "calc(100% + 48px)", // Still need this because negative margin pulls it out, but width needs to grow.
        // Tailwind 'w-[calc(100%+3rem)]' could work but inline is fine for calc.
        // Actually, if we use -mx-6 (which is -1.5rem = -24px per side), total width needed is 100% + 48px.
        // The container padding in Home.tsx is p={3} which is 24px.
        // So this aligns perfectly.
      }}
    >
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full">
        {tabs.map((device) => {
          const isActive = selectedDevice === device;
          return (
            <Button
              key={device}
              variant="ghost" // Use ghost as base to avoid default solid styles
              size="sm"
              onClick={() => onSelectDevice(device)}
              className={cn(
                "rounded-full h-9 px-4 transition-all duration-300 whitespace-nowrap border",
                isActive
                  ? "bg-white/80 dark:bg-black/60 border-white/40 dark:border-white/10 text-primary shadow-sm font-semibold scale-105"
                  : "bg-transparent border-transparent text-muted-foreground hover:bg-white/20 hover:text-foreground hover:border-white/10"
              )}
            >
              {getIcon(device === "All" ? "all" : device, isActive)}
              {device}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceTabs;
