## 2024-05-23 - Authentication Form Polish
**Learning:** Adding a `CircularProgress` inside a disabled button provides much better feedback than just changing text to "Loading...", but care must be taken with `disabled` state styling (opacity/color) to ensure the spinner is visible. Also, changing input types from `text` to `email` is a zero-effort change that massively improves mobile UX by triggering the correct keyboard.
**Action:** Always check input types in auth forms and consider inline spinners for async buttons.

## 2024-05-24 - Accessibility on Responsive Icon Buttons
**Learning:** When using responsive layouts where text labels are hidden on small screens (e.g., `md:hidden`), the button becomes icon-only and loses its accessible name. Adding `aria-label` ensures screen readers can identify the button regardless of the viewport size or CSS display properties.
**Action:** Always add `aria-label` to buttons that might become icon-only in responsive views.

## 2025-05-19 - Accessible Inactive States
**Learning:** Using `hidden` (`display: none`) to hide labels for inactive states (like unselected tabs) removes them from the accessibility tree, leaving screen reader users with unnamed buttons. Replacing `hidden` with `sr-only` preserves the accessible name while maintaining the collapsed visual design.
**Action:** Use `sr-only` instead of `hidden` for text labels that are visually toggled but should remain accessible.
