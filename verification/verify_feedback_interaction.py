from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        try:
            page.goto("http://localhost:5173/sign-in", timeout=60000)
            page.wait_for_selector("text=Description", timeout=10000)

            # Select type
            # The Select component in shadcn usually renders a button that opens a content overlay.
            # But the options might be in a portal.
            page.click("button[role=\"combobox\"]") # Select trigger
            # Wait for content to appear
            # page.wait_for_selector("text=a bug")
            # In playwright with shadcn/radix select, sometimes it helps to press ArrowDown and Enter
            page.keyboard.press("ArrowDown")
            page.keyboard.press("Enter")

            # Fill description
            page.fill("textarea", "This is a test bug report.")

            # Click send
            page.click("button[type=\"submit\"]")

            # Take screenshot immediately to capture loading state
            # My mock has 2s delay
            time.sleep(0.5)
            page.screenshot(path="verification/feedback_loading.png")
            print("Loading screenshot taken")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/feedback_error.png")

        browser.close()

if __name__ == "__main__":
    run()
