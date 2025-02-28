import { Chrome, Globe2, PlusIcon, TabletIcon } from "lucide-react";
import { EXTENSION_PAGE } from "../utils/constants";

export default function EmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {/* Decorative elements */}
        <div className="relative">
          <div className="absolute -left-8 -top-6 flex h-16 w-16 items-center justify-center rounded-lg bg-muted/50 blur-sm animate-pulse">
            <TabletIcon className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-primary/5 animate-pulse">
            <Globe2 className="h-12 w-12 text-primary" />
          </div>
          <div className="absolute -bottom-6 -right-8 flex h-16 w-16 items-center justify-center rounded-lg bg-muted/50 blur-sm">
            <TabletIcon className="h-8 w-8 text-muted-foreground/50" />
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-semibold tracking-tight">
          Waiting for your tabs
        </h2>
        <p className="mb-8 mt-2 text-center text-sm text-muted-foreground">
          Your synchronized tabs will appear here. Open a new tab to get
          started.
        </p>

        <a
          href="about:newtab"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary gap-2 my-2"
        >
          <PlusIcon className="h-4 w-4" />
          Open New Tab
        </a>
        <a
          href={EXTENSION_PAGE}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline gap-2 my-2"
        >
          <Chrome className="h-4 w-4" />
          Get the extension for Chrome
        </a>
      </div>
    </div>
  );
}
