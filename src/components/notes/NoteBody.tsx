import React, { useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import NoteMarkdown from "./LazyNoteMarkdown";

interface NoteBodyProps {
  body: string;
  /** Other browsers' groups: a shorter preview (about 2 lines) instead of about 5. */
  compact?: boolean;
}

/**
 * Where to cut a collapsed note so no line shows half: the bottom of the last
 * block (paragraph, list item, heading, code block...) that fits the preview
 * height, or, inside a tall block, the last whole line.
 */
const clampHeight = (el: HTMLElement) => {
  const limit = el.clientHeight;
  const top = el.getBoundingClientRect().top;
  const md = (el.firstElementChild as HTMLElement | null) ?? el;
  const line = parseFloat(getComputedStyle(md).lineHeight) || 19;
  let best = 0;
  el.querySelectorAll(".note-md > *, .note-md li, .note-md tr").forEach((b) => {
    const bottom = b.getBoundingClientRect().bottom - top;
    if (bottom <= limit + 0.5 && bottom > best) best = bottom;
  });
  if (best >= limit - line * 1.5) return Math.ceil(best);
  // A tall block straddles the cut: keep whole lines of it after the last block that fit.
  return Math.max(
    line,
    Math.floor(best + Math.floor((limit - best) / line) * line)
  );
};

/**
 * A note's rendered Markdown, collapsed to a short preview in lists; "Show more"
 * renders it in full. The toggle only appears when the note is taller than the
 * preview.
 */
const NoteBody: React.FC<NoteBodyProps> = ({ body, compact = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || expanded) return undefined;
    const check = () => {
      el.style.maxHeight = "";
      const over = el.scrollHeight > el.clientHeight + 1;
      setOverflows(over);
      if (over) el.style.maxHeight = `${clampHeight(el)}px`;
    };
    check();
    // Watch the content (not the clipped box), so re-clamping can't re-trigger itself.
    const content = el.firstElementChild;
    if (typeof ResizeObserver === "undefined" || !content) return undefined;
    const ro = new ResizeObserver(check);
    ro.observe(content);
    return () => {
      ro.disconnect();
      el.style.maxHeight = "";
    };
  }, [body, compact, expanded]);

  return (
    <>
      <div
        ref={ref}
        className={
          expanded
            ? undefined
            : `note-md-clamp${compact ? " note-md-clamp-compact" : ""}`
        }
      >
        <NoteMarkdown body={body} />
      </div>
      {(overflows || expanded) && (
        <button
          type="button"
          className="note-md-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          aria-expanded={expanded}
        >
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
            aria-hidden
          />
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </>
  );
};

export default NoteBody;
