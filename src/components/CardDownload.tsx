import React, { memo } from "react";
import { ExternalLink } from "lucide-react";

import { EXTENSION_PAGE } from "../utils/constants";
import { cn } from "@/lib/utils";

interface IDownLoadCardProps {
  className?: string;
}

/** Links to the browser extension, as a bordered settings-style group. */
const DownloadCard: React.FC<IDownLoadCardProps> = ({ className }) => {
  return (
    <section className={cn("space-y-2", className)}>
      <h3 className="section-label">Browser extension</h3>
      <div className="settings-group">
        <a href={EXTENSION_PAGE} target="_blank" rel="noopener noreferrer" className="settings-row">
          <span className="min-w-0 flex-1">Chrome, Edge &amp; other Chromium browsers</span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
        </a>
        <div className="settings-row text-muted-foreground">
          <span className="min-w-0 flex-1">Firefox</span>
          <span className="text-xs">Coming soon</span>
        </div>
      </div>
    </section>
  );
};

export default memo(DownloadCard);
