import time
from playwright.sync_api import sync_playwright

def test_toolbar_and_urllist_refactor(page):
    # Navigate to the test page
    page.goto("http://localhost:5173/test")

    # Wait for the page to load
    page.wait_for_selector("text=Component Verification")

    # 1. Capture the initial list view
    page.screenshot(path="verification/list_view.png")

    # 2. Toggle layout to grid
    # Find the layout toggle button.
    # It has aria-label or tooltip "Change layout"
    # In my code: <TooltipContent><p>Change layout</p></TooltipContent>
    # The button itself contains Grid3x3TwoTone or ListAltTwoTone.

    # Initially it is "list", so the button should show grid icon (Grid3x3TwoTone) to switch TO grid?
    # Toolbar logic: layout === "grid" ? <Grid3x3TwoTone /> : <ListAltTwoTone />
    # Wait, if layout is 'list', the icon shown is likely 'Grid3x3TwoTone' (meaning "switch to grid")?
    # Or is it showing the CURRENT layout icon?
    # The original code: {layout === "grid" ? <Grid3x3TwoTone /> : <ListAltTwoTone />}
    # Usually this means "Current layout is Grid, show Grid icon".
    # Or "Click to switch to Grid".

    # Let's assume the button is clickable.
    # We can use the tooltip text.

    # Trigger tooltip to see text? No need, just find by role button.
    # There are multiple buttons.

    # The layout button is the 3rd one in the group of 4 (filter, layout, sort).
    # But better to rely on order or icon.

    # Let's just take a screenshot of list view first.

    # Click the layout button.
    # I'll try to find it by the tooltip text if possible, but tooltips are tricky in playwright if not hovered.
    # I'll find the button that contains the SVG for "ListAltTwoTone" or "Grid3x3TwoTone".
    # Since initial state in TestPage is "list", and Toolbar renders:
    # {layout === "grid" ? <Grid3x3TwoTone /> : <ListAltTwoTone />}
    # So it renders ListAltTwoTone.

    # Let's click that button.
    page.locator("button:has(svg[data-testid='ListAltTwoToneIcon'])").click()

    # Wait for re-render
    time.sleep(1)

    # 3. Capture grid view
    page.screenshot(path="verification/grid_view.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_toolbar_and_urllist_refactor(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
