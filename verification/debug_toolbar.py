import time
from playwright.sync_api import sync_playwright, expect

def verify_toolbar(page):
    page.goto("http://localhost:5173/")

    # Inject local storage for dummy user
    page.evaluate("""() => {
        localStorage.setItem('tabSyncSettings', JSON.stringify({
            user: { id: 'dummy-user', email: 'test@example.com' },
            token: 'dummy-token'
        }));
    }""")

    page.reload()

    page.wait_for_selector("body", timeout=5000)

    # Debug: Print all buttons
    buttons = page.get_by_role("button").all()
    print(f"Found {len(buttons)} buttons.")
    for i, btn in enumerate(buttons):
        try:
            aria_label = btn.get_attribute("aria-label") or "None"
            text = btn.inner_text() or "No text"
            print(f"Button {i}: aria-label='{aria_label}', text='{text}'")
        except:
            pass

    # Try to find the refresh button specifically
    print("Checking for 'Refresh tabs' button...")
    try:
        refresh_btn = page.get_by_label("Refresh tabs")
        expect(refresh_btn).to_be_visible(timeout=5000)
        print("Refresh button found!")
    except Exception as e:
        print(f"Refresh button NOT found: {e}")

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
