import time
from playwright.sync_api import sync_playwright, expect

def verify_toolbar(page):
    page.goto("http://localhost:5173/")

    # Inject local storage
    page.evaluate("""() => {
        localStorage.setItem('tabSyncSettings', JSON.stringify({
            user: { id: 'dummy-user', email: 'test@example.com' },
            token: 'dummy-token'
        }));
    }""")

    page.reload()
    page.wait_for_selector("body", timeout=5000)

    # Debug: Print outerHTML of all buttons
    buttons = page.get_by_role("button").all()
    print(f"Found {len(buttons)} buttons.")
    for i, btn in enumerate(buttons):
        try:
            print(f"Button {i} HTML: {btn.evaluate('el => el.outerHTML')}")
        except:
            pass

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_toolbar(page)
        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()
