import React from "react";
import { Pin } from "lucide-react";

import { cn } from "@/lib/utils";
import { IPickupNote } from "../interfaces/iNote";
import { deviceHue, hueStyle } from "../utils/deviceColor";
import { timeAgo } from "../utils/tabMeta";

/** A browser's pick-up note ("where I left off"), pinned on top of its tab group. Written in the extension. */
const PinnedNote: React.FC<{ note: IPickupNote; deviceName: string; className?: string; showDevice?: boolean }> = ({
  note,
  deviceName,
  className,
  showDevice = false,
}) => (
  <div className={cn("pinned-note", className)} style={hueStyle(deviceHue(deviceName))} role="note" aria-label={`Pick-up note from ${deviceName}`}>
    <Pin className="pinned-note-icon mt-[3px] h-3.5 w-3.5 shrink-0 -rotate-45" strokeWidth={2.2} aria-hidden />
    <p className="min-w-0 flex-1 break-words">
      {showDevice && <span className="mr-1.5 font-medium">{deviceName}:</span>}
      {note.body}
      <span className="ml-1.5 whitespace-nowrap text-[11.5px] text-muted-foreground">{timeAgo(note.updated_at)}</span>
    </p>
  </div>
);

export default PinnedNote;
