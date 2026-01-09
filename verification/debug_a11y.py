from playwright.sync_api import sync_playwright, expect

def debug_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:5173")
        page.wait_for_load_state("networkidle")

        print("--- All Buttons on Page ---")
        buttons = page.get_by_role("button").all()
        for btn in buttons:
            name = btn.get_attribute("aria-label") or btn.text_content()
            print(f"Button: '{name.strip() if name else '[No Name]'}'")

        print("\n--- Checking for Feedback Button specifically ---")
        # Try finding by text first, then label
        text_btn = page.get_by_text("Feedback & Support")
        if text_btn.count() > 0:
             print(f"Found {text_btn.count()} elements with text 'Feedback & Support'")

        label_btn = page.get_by_label("Feedback & Support")
        if label_btn.count() > 0:
             print(f"Found {label_btn.count()} elements with label 'Feedback & Support'")

        browser.close()

if __name__ == "__main__":
    debug_accessibility()
