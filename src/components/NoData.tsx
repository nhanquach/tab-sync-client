import React from "react";
import { MonitorSmartphone, SearchX } from "lucide-react";

interface INoDataProps {
  isEmptySearch: boolean;
}

const NoData: React.FC<INoDataProps> = ({ isEmptySearch }) => {
  const Icon = isEmptySearch ? SearchX : MonitorSmartphone;
  return (
    <div className="px-6 py-16 text-center">
      <Icon className="mx-auto h-6 w-6 text-muted-foreground" aria-hidden />
      <p className="mt-3 text-sm font-medium">{isEmptySearch ? "No tabs match your search" : "No tabs here yet"}</p>
      <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
        {isEmptySearch
          ? "Tabs are searched by title and URL. Try another term or pick a different device."
          : "Open a tab in a browser with the TabSync extension and it shows up here. Closed tabs move to Archived."}
      </p>
    </div>
  );
};

export default NoData;
