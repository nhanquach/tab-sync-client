"use client";

import { useState } from "react";
import { RefreshCcwDot } from "lucide-react";

import refresh from "./actions";

const ReloadButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 250);
    }
  };

  return (
    <button
      className="btn btn-xs btn-soft"
      type="button"
      onClick={handleRefresh}
    >
      <RefreshCcwDot className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      Refresh
    </button>
  );
};

export default ReloadButton;
