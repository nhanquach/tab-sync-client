from playwright.sync_api import sync_playwright
import json

def verify_limit_dialog_debug():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Listen for errors
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

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

        # Check visibility
        if page.locator("aside").is_visible():
            print("Sidebar is visible.")
        else:
            print("Sidebar NOT visible.")

        browser.close()

if __name__ == "__main__":
    verify_limit_dialog_debug()
