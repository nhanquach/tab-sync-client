from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

        try:
            page.goto("http://localhost:5173/sign-in", timeout=60000)
            page.wait_for_selector("text=Description", timeout=10000)
            page.screenshot(path="verification/signin_debug.png")
            print("Screenshot taken")
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/signin_error.png")

        browser.close()

if __name__ == "__main__":
    run()
