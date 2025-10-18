import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # 1. Navigate to the app
            await page.goto("http://localhost:4174")

            # Give it a moment to load
            await page.wait_for_timeout(2000)

            # 2. Verify the Chat interface is visible by default
            await expect(page.get_by_role("heading", name="RAG on Web")).to_be_visible()
            await expect(page.get_by_placeholder("Ask a question...")).to_be_visible()

            # Take a screenshot of the chat page
            await page.screenshot(path="jules-scratch/verification/01_chat_view.png")
            print("Screenshot 1 taken.")

            # 3. Switch to Data Registration tab
            await page.get_by_role("button", name="Data Registration").click()

            # 4. Verify the Data Registration interface is visible
            await expect(page.get_by_role("heading", name="Data Registration")).to_be_visible()
            await expect(page.get_by_role("button", name="Upload File")).to_be_visible()

            # Take a screenshot of the data registration page
            await page.screenshot(path="jules-scratch/verification/02_data_registration_view.png")
            print("Screenshot 2 taken.")

            # 5. Switch to URL sub-tab
            await page.get_by_role("button", name="Register URL").click()
            await expect(page.get_by_label("Enter Web Page URL")).to_be_visible()

            # Take a screenshot of the URL registration view
            await page.screenshot(path="jules-scratch/verification/03_final_view.png")
            print("Screenshot 3 taken.")

            print("\nVerification successful!")

        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())