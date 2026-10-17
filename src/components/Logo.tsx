import React from "react";

import { cn } from "@/lib/utils";

/**
 * The Loop mark: a cloud, a tab on its strip and the round trip between them, in deep teal
 * on the pastel teal tile. Same glyph as the extension's LogoMark (see its docs/brand).
 */
const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={cn(
      "bg-signature inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-primary-foreground",
      className
    )}
    aria-hidden
  >
    <svg
      viewBox="0 -1 24 24"
      className="h-[84%] w-[84%]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.68 9.28A2.48 2.48 0 0 1 8.48 4.56a3.68 3.68 0 0 1 6.48-.16A2.56 2.56 0 0 1 16 9.28Z" />
      <path d="M6.6 19q1.8 0 1.8-1.8v-.6q0-2.2 2.2-2.2h2.8q2.2 0 2.2 2.2v.6q0 1.8 1.8 1.8Z" fill="currentColor" stroke="none" />
      <rect x="5.2" y="18.65" width="13.6" height="1.4" rx="0.7" fill="currentColor" stroke="none" />
      <path d="M4.6 17.2C2.4 14.6 2.4 11.4 4.2 9.2M2.4 9.6l2.2-.8.6 2.3" />
      <path d="M19.4 6.8c2.2 2.6 2.2 5.8.4 8M21.6 14.4l-2.2.8-.6-2.3" />
    </svg>
  </span>
);

export default Logo;
