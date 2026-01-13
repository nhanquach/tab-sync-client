from playwright.sync_api import sync_playwright, Page

def verify_dialogs(page: Page):
    # Listen for console logs
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

    page.goto("http://localhost:5173/test-dialogs")

    # Wait for the header
    try:
        page.wait_for_selector("text=Dialog Design Verification", timeout=5000)
        print("Header found.")
    except:
        print("Header NOT found within timeout.")

    # Try to find any button
    buttons = page.locator("button").all()
    print(f"Found {len(buttons)} buttons.")

    if len(buttons) > 0:
        buttons[0].click()
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/feedback_dialog.png")
        page.keyboard.press("Escape")
        page.wait_for_timeout(500)

    if len(buttons) > 1:
        buttons[1].click()
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/qrcode_dialog.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_dialogs(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
