import React from "react";

import AppShell from "./AppShell";

/** Shown while the session loads: the real shell with skeleton rows. */
const LoadingHomeShell: React.FC = () => {
  return (
    <AppShell active="open" isLoading>
      <div className="pb-3 pt-4 md:pt-6">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">TabSync</p>
        <div className="mt-1 h-5 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-10 animate-pulse rounded-md bg-muted/60" />
      </div>
      <div className="space-y-1" aria-label="Loading your tabs">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="shimmer h-9 rounded-lg" />
        ))}
      </div>
    </AppShell>
  );
};

export default LoadingHomeShell;
