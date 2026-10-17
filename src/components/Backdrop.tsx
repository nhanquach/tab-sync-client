import React from "react";

/**
 * The faint tint behind the UI (same as the extension's Backdrop): two large, blurred,
 * static blobs at very low opacity (--blob-a), so the page reads as near-neutral grey with
 * a hint of teal. Frosted surfaces sit on top. Solid colours only, no gradients, no motion.
 */
const BLOBS: { className: string; color: string }[] = [
  // Muted signature teal, top left.
  { className: "-left-40 -top-40 h-[34rem] w-[34rem]", color: "hsl(168 40% 62%)" },
  // Muted slate blue, bottom right.
  { className: "-bottom-40 -right-40 h-[34rem] w-[34rem]", color: "hsl(212 40% 62%)" },
];

const Backdrop: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
    {BLOBS.map((b, i) => (
      <span key={i} className={`blob ${b.className}`} style={{ backgroundColor: b.color }} />
    ))}
  </div>
);

export default Backdrop;
