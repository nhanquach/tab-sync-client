import React, { lazy, Suspense } from "react";

import { markdownToPlain } from "../../utils/noteMarkdown";
import { loadNoteMarkdown } from "./noteMarkdownLoader";

const NoteMarkdown = lazy(loadNoteMarkdown);

/**
 * A note's Markdown, rendered once the renderer chunk is in (usually already
 * preloaded). Until then: the note as plain text, never raw Markdown syntax.
 */
const LazyNoteMarkdown: React.FC<{ body: string }> = ({ body }) => (
  <Suspense
    fallback={
      <div className="note-md">
        <p>{markdownToPlain(body)}</p>
      </div>
    }
  >
    <NoteMarkdown body={body} />
  </Suspense>
);

export default LazyNoteMarkdown;
