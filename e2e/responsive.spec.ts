import { authenticate, expect, resetMockApi, test } from "./support";

test("mobile gallery upload stays within the viewport", async ({
	context,
	page,
}) => {
	await resetMockApi(page);
	await authenticate(context);
	await page.goto("/galleries/gallery-a");

	await page.locator("#gallery-images").setInputFiles({
		name: "a-very-long-gallery-image-filename-that-must-not-overflow.png",
		mimeType: "image/png",
		buffer: Buffer.from("responsive image fixture"),
	});

	await expect(
		page.getByRole("button", {
			name: "Remove a-very-long-gallery-image-filename-that-must-not-overflow.png",
		}),
	).toBeVisible();
	await expect(
		page.getByRole("navigation", { name: "Mobile navigation" }),
	).toBeVisible();
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= window.innerWidth,
		),
	).toBe(true);
});
