import React from "react";
import { cn } from "@/lib/utils";
import { LaptopMacTwoTone, PhoneIphoneTwoTone, DevicesOtherTwoTone, AppsTwoTone, Check } from "@mui/icons-material";

interface IDeviceTabsProps {
  devices: string[];
  selectedDevice: string;
  onSelectDevice: (device: string) => void;
}

const DeviceTabs: React.FC<IDeviceTabsProps> = ({ devices, selectedDevice, onSelectDevice }) => {
  // Helper to guess icon based on name
  const getIcon = (name: string, isActive: boolean) => {
    const className = cn("mr-2 h-4 w-4", isActive ? "text-md-sys-color-on-secondary-container" : "text-md-sys-color-on-surface-variant");

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
        "sticky z-30 w-full py-3 mb-6 -mx-6 px-6",
        "bg-md-sys-color-surface/95 backdrop-blur-sm",
        "border-b border-md-sys-color-outline-variant/20",
        "flex items-center",
        // Desktop: Sticky to very top (0) because header is gone.
        // Mobile: Sticky to headerHeight (64) + some gap?
        // Actually, header is fixed at top-0. Height 64.
        // So top-16 (64px) creates perfect alignment below header.
        "top-16 md:top-0"
      )}
      style={{
        width: "calc(100% + 48px)",
      }}
    >
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full p-1">
        {tabs.map((device) => {
          const isActive = selectedDevice === device;
          return (
            <button
              key={device}
              onClick={() => onSelectDevice(device)}
              className={cn(
                "relative flex items-center justify-center rounded-lg px-4 h-8 transition-all duration-200 whitespace-nowrap select-none",
                "text-sm font-medium",
                "border",
                isActive
                  ? "bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container border-transparent"
                  : "bg-transparent border-md-sys-color-outline text-md-sys-color-on-surface-variant hover:bg-md-sys-color-surface-container-high"
              )}
            >
              {isActive && <Check className="mr-1.5 h-4 w-4" />}
              {!isActive && getIcon(device === "All" ? "all" : device, false)}
              {device}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceTabs;
