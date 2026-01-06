## 2024-05-23 - Authentication Form Polish
**Learning:** Adding a `CircularProgress` inside a disabled button provides much better feedback than just changing text to "Loading...", but care must be taken with `disabled` state styling (opacity/color) to ensure the spinner is visible. Also, changing input types from `text` to `email` is a zero-effort change that massively improves mobile UX by triggering the correct keyboard.
**Action:** Always check input types in auth forms and consider inline spinners for async buttons.

## 2024-05-23 - Mobile Menu Accessibility
**Learning:** Hiding text labels in dropdown menus on mobile (using `display: none`) and relying solely on icons is a major accessibility and UX fail. Screen readers may skip the items entirely, and visual users lose context.
**Action:** Ensure menu items always have visible or at least screen-reader-accessible text labels, regardless of screen size.
