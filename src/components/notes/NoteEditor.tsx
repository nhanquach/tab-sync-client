import React, { useEffect, useRef, useState } from "react";
import { Link2, Plus, X } from "lucide-react";

import { IDevice } from "../../interfaces/iNote";
import { INoteLink } from "../../hooks/useNotes";
import { canAttachUrl, charsLeft, cleanNote, NOTE_MAX, noteErrorMessage, normalizeUrl } from "../../utils/notes";
import { hostOf } from "../../utils/tabMeta";

interface INoteEditorProps {
  initial?: string;
  initialLink?: INoteLink | null;
  /** New notes from the web: which browser it's for (dropdown). */
  devices?: IDevice[];
  deviceId?: string;
  onDeviceChange?: (id: string) => void;
  label: string;
  placeholder?: string;
  saveLabel?: string;
  onSave: (text: string, link: INoteLink | null) => Promise<void>;
  onCancel: () => void;
  autoFocus?: boolean;
}

/** Note editor (same look as the extension): text, optional link, Enter saves, Esc cancels. */
const NoteEditor: React.FC<INoteEditorProps> = ({
  initial = "",
  initialLink = null,
  devices,
  deviceId,
  onDeviceChange,
  label,
  placeholder = "Write a note…",
  saveLabel = "Save",
  onSave,
  onCancel,
  autoFocus = true,
}) => {
  const [text, setText] = useState(initial);
  const [link, setLink] = useState<INoteLink | null>(initialLink);
  const [linkInput, setLinkInput] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const left = charsLeft(text);
  const clean = cleanNote(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || !autoFocus) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [autoFocus]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [text]);

  const pendingUrl = linkInput !== null ? normalizeUrl(linkInput) : "";
  const linkInvalid = linkInput !== null && linkInput.trim() !== "" && !canAttachUrl(pendingUrl);

  const save = async () => {
    if (!clean || left < 0 || linkInvalid) return;
    const finalLink =
      linkInput !== null && linkInput.trim() ? { url: pendingUrl, title: hostOf(pendingUrl) } : link;
    if (clean === initial.trim() && (finalLink?.url ?? null) === (initialLink?.url ?? null)) {
      onCancel();
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onSave(clean, finalLink);
    } catch (e) {
      console.error(e);
      setError(noteErrorMessage(e));
      setBusy(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="note-editor animate-in fade-in-0 zoom-in-95" onKeyDown={onKeyDown} onClick={(e) => e.stopPropagation()}>
      {devices && devices.length > 0 && onDeviceChange && (
        <label className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="shrink-0">For</span>
          <select
            value={deviceId}
            onChange={(e) => onDeviceChange(e.target.value)}
            disabled={busy}
            className="note-select"
            aria-label="Which browser this note is for"
          >
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name || "Unnamed browser"}
                {d.browser && d.browser !== "unknown" ? ` · ${d.browser[0].toUpperCase()}${d.browser.slice(1)}` : ""}
              </option>
            ))}
          </select>
        </label>
      )}
      <textarea
        ref={ref}
        rows={1}
        value={text}
        maxLength={NOTE_MAX}
        onChange={(e) => setText(e.target.value.replace(/[\r\n]+/g, " "))}
        placeholder={placeholder}
        aria-label={label}
        disabled={busy}
        className="block w-full resize-none bg-transparent text-sm leading-5 outline-none placeholder:text-muted-foreground"
      />
      {link && linkInput === null && (
        <div className="note-link-chip mt-1.5" title={link.url}>
          <Link2 className="h-3 w-3 shrink-0" aria-hidden />
          <span className="min-w-0 truncate">{link.title || hostOf(link.url)}</span>
          <button
            type="button"
            onClick={() => setLink(null)}
            disabled={busy}
            className="-mr-1 rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Remove link"
            title="Remove link"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      {linkInput !== null && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <Link2 className="h-3.5 w-3.5 shrink-0 text-primary-ink" aria-hidden />
          <input
            autoFocus
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            placeholder="Paste a link (optional)"
            aria-label="Link"
            aria-invalid={linkInvalid}
            className="h-7 min-w-0 flex-1 rounded-md border border-border bg-transparent px-2 text-[13px] outline-none focus:border-[hsl(var(--primary-ink))]"
          />
          <button
            type="button"
            onClick={() => setLinkInput(null)}
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Cancel link"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <div className="mt-1.5 flex items-center gap-1.5">
        {!link && linkInput === null ? (
          <button
            type="button"
            onClick={() => setLinkInput("")}
            disabled={busy}
            className="inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-xs font-medium text-primary-ink transition-colors hover:bg-accent"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add link
          </button>
        ) : (
          <span className={`text-[11px] tabular-nums ${left < 0 ? "font-semibold text-destructive" : "text-muted-foreground"}`}>
            {left < 20 ? `${left} left` : `${NOTE_MAX - left}/${NOTE_MAX}`}
          </span>
        )}
        {(error || linkInvalid) && (
          <span role="alert" className="min-w-0 truncate text-[11px] text-destructive">
            {error || "That link doesn't look right (http, https or file)."}
          </span>
        )}
        <span className="flex-1" />
        <button
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="h-7 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={busy || !clean || left < 0 || linkInvalid}
          onClick={save}
          className="bg-signature h-7 rounded-md px-2.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Saving…" : saveLabel}
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
