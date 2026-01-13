from playwright.sync_api import sync_playwright, Page

def verify_home_design(page: Page):
    page.goto("http://localhost:5173/test-home-design")
    page.wait_for_timeout(2000) # Wait for animation/load
    page.screenshot(path="verification/home_design.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use large viewport to show side-by-side
        context = browser.new_context(viewport={"width": 1400, "height": 900})
        page = context.new_page()
        try:
            verify_home_design(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
