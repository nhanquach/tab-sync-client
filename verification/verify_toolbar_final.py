import time
from playwright.sync_api import sync_playwright, expect

def verify_toolbar(page):
    # Just go to the root, which redirects to sign in (or we injected storage to go home, but we modified SignIn to show toolbars)
    # The output says we found 16 buttons, and multiple "Refresh tabs".
    # This means our modification to SignIn.tsx worked!

    page.goto("http://localhost:5173/")

    page.wait_for_selector("body", timeout=5000)

    # We added two toolbars to SignIn.tsx
    # One scrolled=false (default), one scrolled=true

    # 1. Verify Refresh button (First toolbar)
    refresh_btns = page.get_by_label("Refresh tabs")
    expect(refresh_btns.first).to_be_visible()

    # Test tooltip for Refresh
    refresh_btns.first.hover()
    time.sleep(0.5)
    page.screenshot(path="verification/toolbar_refresh.png")

    # 2. Verify Search button (Scrolled toolbar)
    search_expand_btn = page.get_by_label("Expand search")
    expect(search_expand_btn).to_be_visible()

    # Test tooltip for Search Expand
    search_expand_btn.hover()
    time.sleep(0.5)
    page.screenshot(path="verification/toolbar_search_expand.png")

    # 3. Verify Layout Toggle (First toolbar)
    layout_btn = page.get_by_label("Switch to grid view").first
    expect(layout_btn).to_be_visible()

    # Test tooltip for Layout
    layout_btn.hover()
    time.sleep(0.5)
    page.screenshot(path="verification/toolbar_layout.png")

    # 4. Verify Selection Mode Toggle (Second toolbar - checked)
    selection_btn = page.get_by_label("Exit selection mode")
    expect(selection_btn).to_be_visible()

    # Test tooltip for Selection
    selection_btn.hover()
    time.sleep(0.5)
    page.screenshot(path="verification/toolbar_selection.png")

    print("All verifications passed!")

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
