import { authenticate, expect, resetMockApi, test } from "./support";

test.beforeEach(async ({ context, page }) => {
	await resetMockApi(page);
	await authenticate(context);
});

test("visual search stays scoped to the selected gallery", async ({ page }) => {
	await page.goto("/search?gallery=gallery-a");

	await expect(page.getByLabel("Gallery scope")).toHaveValue("gallery-a");
	await page.getByLabel("Search image").setInputFiles({
		name: "face-query.jpg",
		mimeType: "image/jpeg",
		buffer: Buffer.from("playwright face query"),
	});
	await page.getByRole("button", { name: "Search selected gallery" }).click();

	await expect(page.getByText("1 results")).toBeVisible();
	await expect(page.getByText("93% match")).toBeVisible();
	await expect(page.getByText("Face matches / Portrait Studies")).toBeVisible();
});
