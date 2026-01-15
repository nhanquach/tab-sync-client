import time
from playwright.sync_api import sync_playwright, expect

def verify_toolbar(page):
    page.goto("http://localhost:5173/")

    # Inject local storage for dummy user
    # Note: supabaseClient.ts expects 'tabSyncSettings' key in localStorage.
    # And inside that, it expects { tabSyncSettings: { ... } } structure based on getLocalSettings() function?
    # Let's check getLocalSettings in supabaseClient.ts:
    # const tabSyncSettings = localStorage.getItem("tabSyncSettings");
    # if (tabSyncSettings) { return JSON.parse(tabSyncSettings).tabSyncSettings; }
    # So the structure must be { tabSyncSettings: { user: ..., token: ... } }

    page.evaluate("""() => {
        localStorage.setItem('tabSyncSettings', JSON.stringify({
            tabSyncSettings: {
                user: { id: 'dummy-user', email: 'test@example.com' },
                token: { access_token: 'dummy-token' },
                deviceName: 'Test Device'
            }
        }));
    }""")

    page.reload()

    page.wait_for_selector("body", timeout=5000)

    # Wait for Home component to load.
    # It might redirect to Sign In if user is null.
    # With the injected storage, it should hopefully think we are logged in.

    time.sleep(2)

    # Debug: Print outerHTML of all buttons
    buttons = page.get_by_role("button").all()
    print(f"Found {len(buttons)} buttons.")
    for i, btn in enumerate(buttons):
        try:
            aria_label = btn.get_attribute("aria-label") or "None"
            print(f"Button {i} Aria: {aria_label}")
        except:
            pass

    # Try to find the refresh button
    print("Checking for 'Refresh tabs' button...")
    try:
        refresh_btn = page.get_by_label("Refresh tabs")
        expect(refresh_btn).to_be_visible(timeout=5000)
        print("Refresh button found!")

        # Test tooltip
        refresh_btn.hover()
        time.sleep(0.5)
        page.screenshot(path="verification/toolbar_refresh_tooltip.png")
        print("Screenshot of Refresh tooltip taken.")

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
