import React from "react";
import { ShieldCheck } from "lucide-react";

/** Privacy reassurance, kept to one quiet line. */
const TipsFooter: React.FC = () => {
  return (
    <p className="mt-6 flex items-start justify-center gap-1.5 px-2 text-center text-xs text-muted-foreground">
      <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>
        TabSync only syncs your tabs. It never syncs or stores cookies, sessions or login credentials.
      </span>
    </p>
  );
};

export default TipsFooter;
