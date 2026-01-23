import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        # Use a mobile viewport
        iphone_13 = p.devices['iPhone 13']
        browser = await p.chromium.launch()
        context = await browser.new_context(**iphone_13)
        page = await context.new_page()

        try:
            print("Navigating to http://localhost:3000/test-home/open_tabs...")
            await page.goto("http://localhost:3000/test-home/open_tabs", timeout=60000)

            # Wait a bit for layout to settle (it stays in loading state)
            await page.wait_for_timeout(2000)

            # Check Toolbar position
            # Toolbar usually has a search input, let's look for that or the buttons
            toolbar_btn = page.locator('button[aria-label="Refresh tabs"]')
            await toolbar_btn.wait_for(state="visible")

            box = await toolbar_btn.bounding_box()
            y_pos = box['y']

            print(f"Toolbar Y position: {y_pos}")

            # If it's near the top (e.g. < 150px), it's good.
            # If it's in the middle (e.g. > 300px), it's bad.

            viewport_height = iphone_13['viewport']['height']
            print(f"Viewport height: {viewport_height}")

            if y_pos > viewport_height / 3:
                print("FAIL: Toolbar is pushed down significantly.")
            else:
                print("PASS: Toolbar is near the top.")

            await page.screenshot(path="verification/loading_position.png")
            print("Screenshot saved.")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="verification/loading_error.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
