import { expect, resetMockApi, test } from "./support";

test.beforeEach(async ({ context, page }) => {
	await context.clearCookies();
	await resetMockApi(page);
});

test("protected pages redirect anonymous visitors to login", async ({
	page,
}) => {
	await page.goto("/dashboard");

	await expect(page).toHaveURL(/\/login$/);
	await expect(
		page.getByRole("heading", { name: "Welcome back" }),
	).toBeVisible();
});

test("registration accepts a Laravel response with a null role", async ({
	page,
}) => {
	await page.goto("/register");
	await page.getByLabel("Artist handle / name").fill("E2E Curator");
	await page
		.getByLabel("Curator electronic mail")
		.fill("curator-e2e@example.test");
	await page.getByLabel("Access key / password").fill("secure-password");
	await page.getByLabel("Confirm access key").fill("secure-password");
	await page.getByRole("checkbox").check();
	await page.getByRole("button", { name: /Create account/ }).click();

	await expect(page).toHaveURL(/\/dashboard$/);
	await expect(
		page.getByRole("heading", { name: "Good to see you, E2E." }),
	).toBeVisible();
	await expect(
		page.getByText("The API returned an invalid registration response."),
	).toHaveCount(0);
});

test("a user can sign in and log out", async ({ page }) => {
	await page.goto("/login");
	await page.getByLabel("Identifier").fill("naledi@fmi.test");
	await page.getByLabel("Access key").fill("password");
	await page.getByRole("button", { name: /Sign in/ }).click();

	await expect(page).toHaveURL(/\/dashboard$/);
	await page.getByRole("button", { name: "Log out" }).click();
	await expect(page).toHaveURL(/\/$/);

	await page.goto("/profile");
	await expect(page).toHaveURL(/\/login$/);
});
