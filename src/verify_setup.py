from playwright.sync_api import sync_playwright, expect
import time

def verify_device_tabs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Grant permissions for clipboard if needed, though not strictly required for this test
        context = browser.new_context(
            permissions=["clipboard-read", "clipboard-write"],
            viewport={"width": 1280, "height": 720}
        )
        page = context.new_page()

        # Mock the user object in local storage or app state if necessary.
        # However, looking at Home.tsx, it seems to handle `user` prop gracefully or we might need to be authenticated.
        # The prompt mentioned "Verifying protected routes... requires mocking the User object".
        # Let's try to bypass auth or mock it.
        # Since I can't easily modify the Auth provider from outside, I'll rely on the app redirection
        # or mock the necessary API calls if it tries to fetch tabs.

        # NOTE: The memory says "Unrecognized routes ... redirect to Sign In".
        # And "Verifying protected routes (like /home) via Playwright requires mocking the User object or temporarily bypassing authentication in App.tsx"

        # Let's try to mock the API responses for getOpenTabs and getArchivedTabs to return dummy data with different device names.
        # But first, let's see if we can render the Home page without full auth if we mock the user prop?
        # Actually, `App.tsx` likely handles the routing protection.
        # I'll try to navigate to /home/open_tabs and see if it redirects.
        # If it redirects, I might need to make a temporary change to App.tsx to allow access or mock the auth state.

        # For now, let's assume I need to mock the API and potentially bypass auth check if possible.
        # But I can't easily bypass auth check without modifying code.
        # Let's try to modify App.tsx temporarily to render Home directly or mock the auth context.

        # Actually, I'll try to just load it. If it redirects to login, I'll modify App.tsx to force render Home for verification.

        print("Navigating to Home...")
        try:
            page.goto("http://localhost:5173/home/open_tabs", timeout=10000)
            page.wait_for_load_state("networkidle")
        except Exception as e:
            print(f"Navigation failed or timed out: {e}")

        # Check if we are on login page
        if "sign-in" in page.url:
            print("Redirected to Sign In. Need to bypass auth.")
            return False

        # If we are on Home, let's inject some dummy tabs via network interception if the backend is not running.
        # But `yarn dev` starts the frontend. The backend clients likely fail.
        # The Home component calls `getOpenTabs`.

        # Let's screenshot to see where we are.
        page.screenshot(path="/home/jules/verification/initial_load.png")

        return True

if __name__ == "__main__":
    success = verify_device_tabs()
    if not success:
        print("Verification script requires Auth bypass.")
