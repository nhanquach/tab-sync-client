/**
 * The Markdown renderer (react-markdown + remark-gfm, ~50 kB gzipped) lives in
 * its own chunk so the first load of the web app doesn't pay for it. Notes
 * start fetching it as soon as there is a note to show.
 */
export const loadNoteMarkdown = () => import("./NoteMarkdown");

export const preloadNoteMarkdown = () => {
  loadNoteMarkdown().catch(() => {
    /* retried by React.lazy on render */
  });
};
