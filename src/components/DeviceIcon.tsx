import React from "react";
import {
  LaptopMacTwoTone,
  PhoneIphoneTwoTone,
  DevicesOtherTwoTone,
  AppsTwoTone,
} from "@mui/icons-material";

interface IDeviceIconProps {
  name: string;
  className?: string;
}

const DeviceIcon: React.FC<IDeviceIconProps> = ({ name, className }) => {
  const lower = name.toLowerCase();

  if (lower === "all") return <AppsTwoTone className={className} />;

  if (
    lower.includes("mac") ||
    lower.includes("windows") ||
    lower.includes("laptop")
  ) {
    return <LaptopMacTwoTone className={className} />;
  }

  if (
    lower.includes("iphone") ||
    lower.includes("android") ||
    lower.includes("mobile")
  ) {
    return <PhoneIphoneTwoTone className={className} />;
  }

  return <DevicesOtherTwoTone className={className} />;
};

export default DeviceIcon;
