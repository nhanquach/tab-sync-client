import React from "react";
import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { noteUrlTransform, safeHref } from "../../utils/noteMarkdown";

/**
 * A note body rendered as Markdown (CommonMark + GFM: headings, emphasis,
 * lists, task lists, links, code, quotes, strikethrough, tables).
 *
 * Safety (the same rules in the extension):
 *   - No raw HTML: react-markdown escapes it (no rehype-raw), so "<script>" shows
 *     as text. No dangerouslySetInnerHTML anywhere.
 *   - Links: only http(s)/mailto (safeHref); they open in a new tab with
 *     rel="noopener noreferrer". Anything else renders as its text.
 *   - Images never load: ![alt](src) renders as its alt text, so a note can't
 *     ping a remote server or trip the extension's CSP.
 *   - Task-list checkboxes are read-only.
 *   - No eval / new Function: react-markdown and remark-gfm build React elements
 *     directly, so this is MV3-CSP safe.
 */

const components: Components = {
  a: ({ href, children }) => {
    const safe = safeHref(href);
    if (!safe) return <span className="note-md-nolink">{children}</span>;
    return (
      <a href={safe} target="_blank" rel="noopener noreferrer" title={safe}>
        {children}
      </a>
    );
  },
  img: ({ alt, src }) => {
    const safe = safeHref(typeof src === "string" ? src : null);
    return (
      <span className="note-md-img" title={safe ?? undefined}>
        {alt || "image"}
      </span>
    );
  },
  input: ({ type, checked }) =>
    type === "checkbox" ? (
      <input
        type="checkbox"
        checked={!!checked}
        disabled
        readOnly
        tabIndex={-1}
        aria-label={checked ? "Done" : "Not done"}
      />
    ) : null,
};

const remarkPlugins = [remarkGfm];

interface NoteMarkdownProps {
  body: string;
  className?: string;
}

const NoteMarkdown: React.FC<NoteMarkdownProps> = ({ body, className }) => (
  <div className={`note-md${className ? ` ${className}` : ""}`}>
    <Markdown
      remarkPlugins={remarkPlugins}
      components={components}
      urlTransform={noteUrlTransform}
    >
      {body}
    </Markdown>
  </div>
);

export default React.memo(NoteMarkdown);
