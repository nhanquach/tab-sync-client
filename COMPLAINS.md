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

## 2. Mobile Dictatorship (Forced Grid Layout)

The application restricts user agency by enforcing layout choices on mobile devices.

**The Problem:**
The application forcibly overrides user layout preferences on screens narrower than 768px (Mobile).
- **Forced Grid:** The interface automatically switches to Grid View.
- **Disabled Choice:** The Layout Toggle button is explicitly disabled (`if (isMobile) return;`), preventing users from switching back to List View.

**Why this matters:**
Grid View is often suboptimal for small screens:
- **Truncation:** Long titles (e.g., Jira tickets, documentation paths) are aggressively truncated, making them indistinguishable.
- **Vertical Space:** Grid cards often consume more vertical space than compact list items, reducing information density.
- **UX Hostility:** Removing control from the user creates frustration. Responsive design should enable adaptation, not enforce restriction.

**The Demand:**
Unlock the Layout Toggle on mobile. Allow users to choose List View if it suits their workflow better. Trust the user to decide how they want to consume their data.

*Responsiveness means adapting to the device, not dictating the experience.*
