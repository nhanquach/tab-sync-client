# Application Complaints

## 1. Visual Identity Crisis (Design Inconsistency) (DONE)

The application currently suffers from a severe lack of visual cohesion.

**The Problem:**
There is a jarring disconnect between the core application interface (Home, Sidebar, Tab Grid) and the secondary interfaces (Authentication, Dialogs).
- **Secondary Interfaces:** embrace a modern "Glassmorphism" aesthetic, featuring `backdrop-blur-xl`, asymmetric borders, and a sense of depth.
- **Core Interface:** clings to a flat, "Solid Geometric" style that feels dated and rigid by comparison.

**Why this matters:**
This inconsistency breaks user immersion and makes the product feel like a patchwork of two different templates (likely a clash between `shadcn/ui` customizations and legacy Material UI patterns). It screams "unfinished MVP" rather than "polished product."

**The Demand:**
Pick a lane and stick to it. If the Glassmorphism look of the `StatsDialog` and `SignIn` page is the intended direction (which it seems to be, as it's more distinctive), then **apply it universally**. The Sidebar should be frosted glass. The Tab Cards should have subtle borders and blur effects.

*Consistency is not a "nice-to-have" feature; it is the baseline for trust.*

## 2. Arbitrary Pagination Limits (Data Jail)

The application enforces a hardcoded limit of 20 items per page with no way to change it.

**The Problem:**
Users are restricted to viewing only 20 tabs at a time, regardless of their screen size or preference.

**Why this matters:**
This is hostile to power users. On a high-resolution display, 20 items leaves mostly empty space. More importantly, it breaks standard browser functionality: I cannot use `Ctrl+F` to find a tab if it's on page 2, 3, or 10. I am forced to click through pagination controls like it's 2005. I feel like I'm viewing my data through a keyhole.

**The Demand:**
Implement a density/pagination control immediately. Allow users to select 20, 50, 100, or "All" items per page. Respect my screen real estate and my intelligence.

## 3. Data Sovereignty Violation (No Export)

**The Problem:**
The application functions as a "roach motel" for data: tabs check in, but they can't check out. There is no functionality to export my data to a standard format (JSON, CSV, HTML).

**Why this matters:**
I am entrusting this tool with my browsing history and workflow state. Without an export feature, I am completely locked into this specific deployment. If the server goes down, if I want to migrate to another tool, or if I simply want to back up my data locally, I am out of luck. Relying on "Bulk Copy" of just URLs is insufficient; I need the metadata (timestamps, device info) that I've generated.

**The Demand:**
Implement a full data export feature immediately.
- **Format:** JSON (for machine readability/restore) and CSV (for spreadsheet analysis).
- **Scope:** All data (Open Tabs, Archived Tabs, Device usage stats).
- **Privacy:** Client-side generation to ensure I can grab my data without it needing to be processed by a third party again.

## 4. The "Potemkin" Command Palette (Broken Search Scope)

**The Problem:**
The `Cmd+K` Command Palette masquerades as a global navigation tool, but it is lobotomized. It only searches through the *currently loaded page* of tabs (the visible 20 items).

**Why this matters:**
This is a UX lie. A Command Palette is a promise of global accessibility ("Press `Cmd+K` to jump anywhere"). But here, if I search for a tab that exists on Page 2, the palette reports "No results found."
This trains users *not* to trust the tool. It forces me to manually paginate or use the slower main search bar. It makes the feature worse than useless—it is misleading.

**The Demand:**
Unify the search logic. The Command Palette must query the *entire* dataset, not just the local DOM.
- **Option A:** Hook `Cmd+K` input to the backend search API (Async Search).
- **Option B:** If the dataset is small enough, pre-load headers for client-side search.
Do not ship a "global" shortcut that only works on 2% of the data.

## 5. The Metadata Desert (Organization Vacuum)

**The Problem:**
The application treats tabs as flat, 2-dimensional objects (Title + URL). It ignores the human context of *why* I opened that tab. A URL is just a pointer. Without context, a list of 200 URLs is a digital junk drawer. I can't tag items as "Urgent", "Reference", or "To Read". I can't add a note saying "Use the code snippet in paragraph 3".

**Why this matters:**
For professional workflows, context is king. If I'm researching 3 different topics, I need to segregate them. Without user-defined metadata (Tags, Notes, Categories), the only way to organize is by... nothing. The app forces a flat hierarchy on complex information. It renders the search function half-blind because I can't search for my own mental model, only the page's title.

**The Demand:**
Add a "Metadata Layer" to the `ITab` interface immediately.
- **Tags:** Allow arbitrary string tags (many-to-many).
- **Notes:** A simple text field for user annotations.
- **Search:** Index these fields so I can search for "Project X" and find all related tabs, even if the page titles don't mention "Project X".

## 6. The One-Way Archive (Data Black Hole)

**The Problem:**
The application treats the "Archive" action as a one-way trip to oblivion. Once a tab enters the "Archived Tabs" list, there is no button, gesture, or command to restore it to the "Open Tabs" view. It is stuck there until I either delete it permanently or... well, that's it.

**Why this matters:**
This fundamentally misunderstands the concept of an "Archive." An archive is storage for *later retrieval*, not a trash can with a fancy name. If I archive a project's tabs to clear my workspace, and then want to resume that project next week, I expect to be able to "Unarchive" them back to my active workspace.
Currently, I have to manually open the URL in a new browser tab, which creates a *duplicate* entry, and then delete the old archived one? This is user-hostile friction. It makes me afraid to use the Archive feature.

**The Demand:**
Implement "Restore" / "Unarchive" functionality immediately.
- **Tab Details:** Add a "Restore to Open Tabs" button for archived items.
- **Bulk Actions:** Allow selecting multiple archived tabs and clicking "Restore".
- **Logic:** Move the record back to the `open_tabs` table (or update its status) and remove it from the `archived_tabs` view.

## 7. The Amnesiac Filters (Broken Device Filtering)

**The Problem:**
The device filtering in the main tab view only populates its list of available devices based on the *currently loaded page* of tabs. If I have tabs from a specific device on page 2, but none on page 1, that device does not appear in the filter dropdown when I'm on page 1.

**Why this matters:**
This fundamentally breaks the purpose of a filter. A filter is supposed to help me find data across my entire dataset. By tying the available filters to the paginated view, the application effectively hides devices from me. I have to manually click through pages hoping to "discover" a device so I can filter by it. It's a completely unpredictable and frustrating user experience that undermines the core navigation of the app.

**The Demand:**
Decouple device discovery from pagination immediately.
- **Backend Sync:** Fetch a distinct list of all `device_names` from the backend global dataset, independent of the currently paginated tabs.
- **Persistent Filters:** Ensure the device filter dropdown always displays all available devices, regardless of which page of tabs the user is currently viewing.

## 8. The Phantom Sync (False Disconnects)

**The Problem:**
The application frequently displays a "Disconnected" state in the UI when the network is momentarily unstable, and it requires a full page refresh to re-establish the connection. It doesn't attempt to automatically reconnect or buffer actions while offline.

**Why this matters:**
This makes the app feel incredibly fragile. It operates strictly as a thin terminal dependent on a perfect Supabase connection. If I'm on a train or a spotty connection, my workflow is interrupted by false alarms. If I try to archive a tab while it briefly says "Disconnected," the action silently fails without queuing.

**The Demand:**
Implement robust offline capabilities and local data caching immediately.
- **Auto-Reconnect:** Implement exponential backoff for re-establishing WebSocket/SSE connections automatically.
- **Action Queuing:** Queue user actions (Archive, Delete, Tagging) locally if offline, and sync them automatically when the connection is restored.
- **Local Cache:** Cache the recent tabs locally (e.g., using IndexedDB) so the UI doesn't look broken during momentary disconnects.
