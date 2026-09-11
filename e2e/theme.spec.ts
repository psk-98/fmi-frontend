import { expect, test } from "./support";

test("theme preference can be changed and persists after reload", async ({
	page,
}) => {
	await page.goto("/");

	await expect(
		page.getByRole("button", { name: "System theme" }),
	).toHaveAttribute("aria-pressed", "true");

	await page.getByRole("button", { name: "Dark theme" }).click();
	await expect(page.locator("html")).toHaveClass(/dark/);
	await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

	await page.reload();
	await expect(
		page.getByRole("button", { name: "Dark theme" }),
	).toHaveAttribute("aria-pressed", "true");
	await expect(page.locator("html")).toHaveClass(/dark/);

	await page.getByRole("button", { name: "Light theme" }).click();
	await expect(page.locator("html")).not.toHaveClass(/dark/);
	await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
