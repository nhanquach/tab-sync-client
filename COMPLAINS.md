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

## 7. The Fragile Tether (Zero Offline Support)

**The Problem:**
The application functions strictly as a thin terminal dependent on an active internet connection and a live Supabase connection. It currently lacks any local data caching, Service Worker implementation for offline mode, or data persistence mechanisms when the network drops.

**Why this matters:**
For an application focused on tab organization and saving contexts for later, reliance on a constant connection introduces significant friction. If a user is travelling, experiencing network instability, or simply wishes to review their saved tabs on an airplane, the application becomes completely non-functional. The lack of offline capabilities breaks the promise of reliable access to one's own saved data.

**The Demand:**
Implement offline support and local data caching immediately.
- **Service Workers:** Utilize `vite-plugin-pwa` to cache application assets and shell.
- **Local Database:** Introduce IndexedDB or a similar client-side storage mechanism to mirror the active `open_tabs` dataset.
- **Sync Mechanism:** Queue user actions (like archiving or deleting tabs) locally while offline, and synchronize them with Supabase once the connection is restored.
