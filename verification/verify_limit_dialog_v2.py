from playwright.sync_api import sync_playwright
import json

def verify_limit_dialog_v2():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Mock User Data
        mock_user = {
            "id": "mock-user-id",
            "email": "test@example.com",
            "app_metadata": {},
            "user_metadata": {},
            "aud": "authenticated",
            "created_at": "2023-01-01T00:00:00.000Z"
        }

        def handle_user_route(route):
            route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps({"user": mock_user})
            )

        def handle_rest_route(route):
            if route.request.method == "HEAD":
                 route.fulfill(status=200, headers={"Content-Range": "0-150/150"})
                 return
            route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps([]),
                headers={"Content-Range": "0-0/0"}
            )

        page.route("**/auth/v1/user", handle_user_route)
        page.route("**/rest/v1/**", handle_rest_route)

        print("Navigating to Home (/home)...")
        try:
            page.goto("http://localhost:3000/home", timeout=30000)
        except Exception as e:
            print(f"Navigation error: {e}")

        page.wait_for_timeout(3000)

        # Debug screenshot
        page.screenshot(path="verification/home_debug.png")

        # 1. Verify TipsFooter Link
        print("Looking for 'Learn more'...")
        try:
             # Just wait for visible
             lm = page.locator("button", has_text="Learn more")
             if lm.count() > 0:
                 print(f"Found {lm.count()} buttons")
                 lm.first.click()
                 page.wait_for_timeout(1000)
                 if page.get_by_text("Fair Usage Policy").is_visible():
                     print("Dialog opened from Footer passed.")
                     page.keyboard.press("Escape")
                 else:
                     print("Dialog NOT visible from Footer.")
             else:
                 print("Learn more button NOT found.")

        except Exception as e:
             print(f"Footer verification failed: {e}")

        browser.close()

if __name__ == "__main__":
    verify_limit_dialog_v2()
