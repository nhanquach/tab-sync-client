from playwright.sync_api import sync_playwright, Page

def verify_sidebar(page: Page):
    page.goto("http://localhost:5173/test-dialogs")
    page.wait_for_timeout(2000) # Wait for load
    page.screenshot(path="verification/home_sidebar.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        # Use desktop viewport to ensure sidebar is visible
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()
        try:
            verify_sidebar(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
