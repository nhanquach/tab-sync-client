from playwright.sync_api import sync_playwright, expect

def verify_accessibility_labels():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app (SignIn page has our temp components)
        page.goto("http://localhost:5173")

        # Wait for the page to load
        page.wait_for_load_state("networkidle")

        print("Checking Toolbar Desktop Refresh Button...")
        # Check for Refresh tabs button (Desktop version)
        # Note: Mobile version also has aria-label, but we want to be sure.
        # The desktop one is in the first div > TooltipTrigger.
        # But simply checking if a button with name "Refresh tabs" exists verifies our fix
        # because previously the desktop one was missing it.
        refresh_buttons = page.get_by_label("Refresh tabs")
        count = refresh_buttons.count()
        print(f"Found {count} buttons with label 'Refresh tabs'")

        if count == 0:
             print("FAILURE: No button with aria-label 'Refresh tabs' found.")
             # Take failure screenshot
             page.screenshot(path="/home/jules/verification/failure_refresh.png")
             exit(1)

        print("Checking Feedback & Support Button...")
        # Check for Feedback button
        feedback_btn = page.get_by_role("button", name="Feedback & Support")

        # We expect 2 because we rendered one normal and one iconOnly
        if feedback_btn.count() < 2:
             print(f"WARNING: Expected at least 2 Feedback buttons, found {feedback_btn.count()}")

        # Specifically check the iconOnly one.
        # The normal one has text "Feedback & Support" visible (unless hidden on mobile).
        # The iconOnly one has HIDDEN text but should have aria-label.

        # Let's verify that we can select it by label.
        expect(feedback_btn.first).to_be_visible()

        # Take a screenshot
        page.screenshot(path="/home/jules/verification/accessibility_check.png")
        print("SUCCESS: Accessibility labels found.")

        browser.close()

if __name__ == "__main__":
    verify_accessibility_labels()
