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
