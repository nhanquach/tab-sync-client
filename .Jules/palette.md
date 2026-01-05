## 2024-05-23 - Authentication Form Polish
**Learning:** Adding a `CircularProgress` inside a disabled button provides much better feedback than just changing text to "Loading...", but care must be taken with `disabled` state styling (opacity/color) to ensure the spinner is visible. Also, changing input types from `text` to `email` is a zero-effort change that massively improves mobile UX by triggering the correct keyboard.
**Action:** Always check input types in auth forms and consider inline spinners for async buttons.
