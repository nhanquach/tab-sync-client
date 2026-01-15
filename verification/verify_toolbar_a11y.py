import time
from playwright.sync_api import sync_playwright, expect

def verify_toolbar(page):
    # Mocking Supabase LocalStorage to prevent login redirect
    page.goto("http://localhost:5173/")

    # Inject local storage for dummy user
    page.evaluate("""() => {
        localStorage.setItem('tabSyncSettings', JSON.stringify({
            user: { id: 'dummy-user', email: 'test@example.com' },
            token: 'dummy-token'
        }));
    }""")

    page.reload()

    # Wait for the toolbar to be visible.
    # The toolbar is sticky at the top or visible in the main content.
    # We look for the "Refresh" button which is icon-only.
    # Currently it has a Tooltip but might not have aria-label yet.

    # We will try to find buttons by their expected new aria-labels.
    # If they don't exist, this script will fail (as expected before changes).

    print("Checking for 'Refresh tabs' button...")
    try:
        refresh_btn = page.get_by_label("Refresh tabs")
        expect(refresh_btn).to_be_visible(timeout=2000)
        print("Refresh button found!")
    except Exception as e:
        print(f"Refresh button NOT found or not labeled: {e}")

    # Layout toggle
    print("Checking for 'Switch to grid view' or 'Switch to list view' button...")
    try:
        # It defaults to one state. Let's try both or the default.
        # Assuming default layout is list? Or grid?
        # We can try to find either.
        layout_btn = page.get_by_label("Switch to grid view").or_(page.get_by_label("Switch to list view"))
        expect(layout_btn).to_be_visible(timeout=2000)
        print("Layout toggle button found!")

        # Hover to see tooltip
        layout_btn.first.hover()
        time.sleep(0.5) # Wait for tooltip animation
        page.screenshot(path="verification/toolbar_tooltip.png")
        print("Screenshot taken.")

    except Exception as e:
        print(f"Layout toggle button NOT found or not labeled: {e}")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_toolbar(page)
        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()
