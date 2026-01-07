from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:5173/home")

        # Wait for dialog to appear (simulating opening it)
        # Note: Since I cannot easily log in via script without more setup,
        # I will check if I can access the FeedbackDialog component in isolation or if I need to mock authentication.
        # Given the "Seamless App Shell" memory, the FeedbackDialog is in HomeAppBar.
        # But /home is protected.
        # Let us try to visit /sign-in first to see if the app loads.

        page.goto("http://localhost:5173/sign-in")
        page.screenshot(path="verification/signin.png")
        print("Screenshot taken")
        browser.close()

if __name__ == "__main__":
    run()
