import { type BrowserContext, expect, type Page, test } from "@playwright/test";

const appOrigin = "http://127.0.0.1:3100";
const mockApiOrigin = "http://127.0.0.1:4010";

async function resetMockApi(page: Page) {
	const response = await page.request.post(`${mockApiOrigin}/__reset`);
	expect(response.ok()).toBeTruthy();
}

async function authenticate(context: BrowserContext) {
	await context.addCookies([
		{
			name: "fmi_session",
			value: "e2e-token",
			url: appOrigin,
			httpOnly: true,
			sameSite: "Lax",
		},
	]);
}

export { authenticate, expect, resetMockApi, test };
