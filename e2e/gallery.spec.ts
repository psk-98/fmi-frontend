import { authenticate, expect, resetMockApi, test } from "./support";

test.beforeEach(async ({ context, page }) => {
	await resetMockApi(page);
	await authenticate(context);
});

test("galleries can be searched and sorted by name", async ({ page }) => {
	await page.goto("/galleries");
	await expect(
		page.getByRole("heading", { name: "Portrait Studies" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Archive Nights" }),
	).toBeVisible();

	await page.getByPlaceholder("Search galleries by name").fill("portrait");
	await expect(
		page.getByRole("heading", { name: "Portrait Studies" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Archive Nights" }),
	).toHaveCount(0);

	await page.getByRole("button", { name: "Clear gallery search" }).click();
	await page.getByLabel("Sort galleries").selectOption("name-asc");

	const galleryNames = page.locator("article h3");
	await expect(galleryNames.first()).toHaveText("Archive Nights");
	await expect(galleryNames.nth(1)).toHaveText("Portrait Studies");
});

test("gallery image preview and delete confirmation use modals", async ({
	page,
}) => {
	await page.goto("/galleries/gallery-a");

	const portraitCard = page
		.getByRole("heading", { name: "portrait-one.jpg" })
		.locator("xpath=ancestor::article");
	await portraitCard.getByRole("button", { name: "View image" }).click();
	const preview = page.getByRole("dialog", { name: "portrait-one.jpg" });
	await expect(preview).toBeVisible();
	await expect(preview.getByText("Gallery image preview")).toBeVisible();
	await preview.getByRole("button", { name: "Close dialog" }).click();
	await expect(preview).toHaveCount(0);

	await portraitCard.getByRole("button", { name: "Delete image" }).click();
	const confirmation = page.getByRole("dialog", { name: "Delete this image?" });
	await expect(confirmation).toBeVisible();
	await confirmation.getByRole("button", { name: "Cancel" }).click();
	await expect(confirmation).toHaveCount(0);
	await expect(
		page.getByRole("heading", { name: "portrait-one.jpg" }),
	).toBeVisible();
});

test("failed images can be reprocessed", async ({ page }) => {
	await page.goto("/galleries/gallery-a");

	const failedCard = page
		.getByRole("heading", { name: "group-failed.jpg" })
		.locator("xpath=ancestor::article");
	await failedCard.getByRole("button", { name: "Reprocess image" }).click();

	await expect(page.getByText("Image queued for processing.")).toBeVisible();
});

test("images can be staged, removed, and appended", async ({ page }) => {
	await page.goto("/galleries/gallery-a");
	const input = page.locator("#gallery-images");
	const upload = {
		name: "new-image.png",
		mimeType: "image/png",
		buffer: Buffer.from("playwright image fixture"),
	};

	await input.setInputFiles(upload);
	await expect(page.getByText("new-image.png", { exact: true })).toBeVisible();
	await page.getByRole("button", { name: "Remove new-image.png" }).click();
	await expect(page.getByText("new-image.png", { exact: true })).toHaveCount(0);

	await input.setInputFiles(upload);
	await page.getByRole("button", { name: "Append 1 image" }).click();
	await expect(
		page.getByRole("heading", { name: "new-image.png" }),
	).toBeVisible();
});

test("gallery deletion asks for confirmation", async ({ page }) => {
	await page.goto("/galleries/gallery-a");
	await page.getByRole("button", { name: "Delete gallery" }).click();

	const dialog = page.getByRole("dialog", { name: "Delete Portrait Studies?" });
	await expect(dialog).toBeVisible();
	await dialog.getByRole("button", { name: "Cancel" }).click();
	await expect(dialog).toHaveCount(0);
	await expect(page).toHaveURL(/\/galleries\/gallery-a$/);
});
