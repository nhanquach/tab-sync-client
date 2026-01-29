# Application Complaints

## 1. Visual Identity Crisis (Design Inconsistency)

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

## 2. Pagination Prison (User Control Issues)

**The Problem:**
The application enforces a rigid 20-items-per-page limit with absolutely no way to change it.
- **Power Users:** With 27-inch monitors, I'm staring at whitespace while clicking "Next" fifty times to find a tab from last week.
- **Search Friction:** Searching happens on the server, but the limited view makes context gathering impossible.

**Why this matters:**
This is a productivity tool, not an Instagram feed. Limiting information density arbitrarily hinders the primary goal: *managing* tabs. I shouldn't have to paginate to see my active workspace.

**The Demand:**
Give me control. Add a "Rows per page" dropdown (20, 50, 100). Better yet, implement an "Infinite Scroll" option so I can just doom-scroll through my chaos like a civilized human being.

*Don't make me click "Next" to see the tab I just closed 5 minutes ago.*
