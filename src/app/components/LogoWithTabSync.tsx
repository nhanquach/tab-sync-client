import React from "react";

import Logo from "./Logo";

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

const LogoWithTabSync: React.FC<{}> = () => {
  return (
    <h4 className="text-2xl flex gap-2 items-center mb-2">
      <Logo />
      TabSync
    </h4>
  );
};

export default LogoWithTabSync;
