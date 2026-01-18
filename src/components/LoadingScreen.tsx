import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-md-sys-color-surface">
      <LoadingSpinner />
    </div>
  );
};

export default LoadingScreen;
