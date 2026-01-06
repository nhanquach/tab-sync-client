import time
from playwright.sync_api import sync_playwright

def test_toolbar_and_urllist_refactor(page):
    # Enable console log collection
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"Page Error: {exc}"))

    # Navigate to the test page
    page.goto("http://localhost:5173/test")

    # Wait for a bit to capture any errors
    time.sleep(5)

    # Try to verify presence of text again
    if page.get_by_text("Component Verification").is_visible():
        print("Page rendered successfully.")
        page.screenshot(path="verification/list_view.png")
    else:
        print("Page did not render correctly.")
        page.screenshot(path="verification/failed_render.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_toolbar_and_urllist_refactor(page)
        finally:
            browser.close()
