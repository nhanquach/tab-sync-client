## 2024-05-23 - Authentication Form Polish
**Learning:** Adding a `CircularProgress` inside a disabled button provides much better feedback than just changing text to "Loading...", but care must be taken with `disabled` state styling (opacity/color) to ensure the spinner is visible. Also, changing input types from `text` to `email` is a zero-effort change that massively improves mobile UX by triggering the correct keyboard.
**Action:** Always check input types in auth forms and consider inline spinners for async buttons.

## 2024-05-24 - Accessibility on Responsive Icon Buttons
**Learning:** When using responsive layouts where text labels are hidden on small screens (e.g., `md:hidden`), the button becomes icon-only and loses its accessible name. Adding `aria-label` ensures screen readers can identify the button regardless of the viewport size or CSS display properties.
**Action:** Always add `aria-label` to buttons that might become icon-only in responsive views.

## 2025-02-20 - Icon-Only Button Labels in Component Libraries
**Learning:** When using component library buttons (like Shadcn/Radix) with conditional text visibility (e.g., `iconOnly` prop toggling a hidden class), the accessible name can be lost if the text is strictly `display: none`. Adding an explicit `aria-label` to the button trigger is the most robust way to ensure accessibility across all states, overriding any potential confusion from hidden child elements.
**Action:** Explicitly add `aria-label` to components that support an "icon-only" mode, even if they have text labels in other modes.
