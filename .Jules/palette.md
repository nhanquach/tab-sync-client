## 2024-05-23 - Authentication Form Polish
**Learning:** Adding a `CircularProgress` inside a disabled button provides much better feedback than just changing text to "Loading...", but care must be taken with `disabled` state styling (opacity/color) to ensure the spinner is visible. Also, changing input types from `text` to `email` is a zero-effort change that massively improves mobile UX by triggering the correct keyboard.
**Action:** Always check input types in auth forms and consider inline spinners for async buttons.

## 2024-05-24 - Accessibility on Responsive Icon Buttons
**Learning:** When using responsive layouts where text labels are hidden on small screens (e.g., `md:hidden`), the button becomes icon-only and loses its accessible name. Adding `aria-label` ensures screen readers can identify the button regardless of the viewport size or CSS display properties.
**Action:** Always add `aria-label` to buttons that might become icon-only in responsive views.

## 2025-05-27 - Semantic State for Filter & Theme Toggles
**Learning:** Visual indicators like color changes or checkmarks are insufficient for screen readers. Using `aria-pressed` for toggle/filter buttons and `role="radiogroup"` with `aria-checked` for 1-of-N selections (like themes) provides critical state context that was otherwise completely invisible to assistive technology.
**Action:** Always verify that "active" visual states have a corresponding ARIA attribute (`aria-pressed`, `aria-checked`, or `aria-current`).
