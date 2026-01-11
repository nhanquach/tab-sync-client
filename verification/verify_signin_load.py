import time
from playwright.sync_api import sync_playwright

def verify_signin_load():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser Error: {err}"))

        try:
            print("Navigating to http://localhost:5173 ...")
            page.goto("http://localhost:5173")

            # Wait for specific element on Sign In page
            # Based on SignInForm.tsx or similar, look for "Sign In" text or input fields
            # We'll wait for body to be visible first
            page.wait_for_selector("body", timeout=10000)

            # Try to wait for something more specific to confirm app loaded logic
            # e.g. "Sign In" heading or button
            try:
                page.wait_for_selector("text=Sign In", timeout=5000)
                print("Found 'Sign In' text.")
            except:
                print("Could not find 'Sign In' text, taking screenshot anyway.")

            time.sleep(2) # Give a bit more time for rendering

            page.screenshot(path="verification/verification_signin.png")
            print("Screenshot taken at verification/verification_signin.png")

        except Exception as e:
            print(f"Script Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_signin_load()
