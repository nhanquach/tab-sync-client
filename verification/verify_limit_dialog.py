from playwright.sync_api import sync_playwright
import json

def verify_limit_dialog():
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

        # 1. Verify TipsFooter Link
        print("Clicking 'Learn more' in footer...")
        try:
             learn_more_btn = page.get_by_text("Learn more")
             learn_more_btn.click()

             page.wait_for_timeout(1000)

             # Check for Dialog Content
             if page.get_by_text("Fair Usage Policy").is_visible():
                 print("Dialog opened from Footer passed.")
             else:
                 print("Dialog NOT visible from Footer.")

             page.screenshot(path="verification/dialog_footer.png")

             # Close Dialog
             # Click outside or find a close button?
             # Desktop doesn't have a close button in my code (just overlay click or escape)
             page.keyboard.press("Escape")
             page.wait_for_timeout(1000)

        except Exception as e:
             print(f"Footer verification failed: {e}")

        # 2. Verify Account Settings Item
        print("Clicking Account Settings Item...")
        try:
            # Open Sidebar Menu
            avatar_btn = page.locator("aside button").last
            avatar_btn.click()
            page.wait_for_timeout(1000)

            # Click the usage item
            usage_item = page.get_by_text("Free Tier Usage")
            usage_item.click()

            page.wait_for_timeout(1000)

            if page.get_by_text("Fair Usage Policy").is_visible():
                 print("Dialog opened from Account Settings passed.")
            else:
                 print("Dialog NOT visible from Account Settings.")

            page.screenshot(path="verification/dialog_settings.png")

        except Exception as e:
             print(f"Settings verification failed: {e}")

        browser.close()

if __name__ == "__main__":
    verify_limit_dialog()
