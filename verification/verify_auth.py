from playwright.sync_api import sync_playwright, Page, expect

def verify_auth_design(page: Page):
    # Navigate to SignIn (Root)
    page.goto("http://localhost:5173/")

    # Wait for the card to be visible (it has animate-in, so give it a moment)
    page.wait_for_timeout(2000)

    # Take screenshot of SignIn
    page.screenshot(path="verification/signin_solid.png")

    # Navigate to SignUp
    page.goto("http://localhost:5173/signup")

    # Wait for the card to be visible
    page.wait_for_timeout(2000)

    # Take screenshot of SignUp
    page.screenshot(path="verification/signup_solid.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_auth_design(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
