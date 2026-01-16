## 2024-05-23 - Authentication Form Polish
**Learning:** Adding a `CircularProgress` inside a disabled button provides much better feedback than just changing text to "Loading...", but care must be taken with `disabled` state styling (opacity/color) to ensure the spinner is visible. Also, changing input types from `text` to `email` is a zero-effort change that massively improves mobile UX by triggering the correct keyboard.
**Action:** Always check input types in auth forms and consider inline spinners for async buttons.

## 2024-05-24 - Accessibility on Responsive Icon Buttons
**Learning:** When using responsive layouts where text labels are hidden on small screens (e.g., `md:hidden`), the button becomes icon-only and loses its accessible name. Adding `aria-label` ensures screen readers can identify the button regardless of the viewport size or CSS display properties.
**Action:** Always add `aria-label` to buttons that might become icon-only in responsive views.

## 2024-05-27 - Tooltips for Icon-Only Buttons
**Learning:** Icon-only buttons (like Refresh or Sort) are common in toolbars but often enigmatic to new users. Simply adding an `aria-label` fixes accessibility for screen readers but leaves visual users guessing. Wrapping these in a `Tooltip` component provides critical context on hover without cluttering the UI.
**Action:** Always pair `aria-label` with `Tooltip` for icon-only toolbar actions.
