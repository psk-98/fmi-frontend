import { defineConfig, devices } from "@playwright/test";

const appPort = 3100;
const mockApiPort = 4010;
const baseURL = `http://127.0.0.1:${appPort}`;

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false,
	workers: 1,
	timeout: 30_000,
	expect: { timeout: 5_000 },
	reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
	use: {
		baseURL,
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
	},
	webServer: [
		{
			command: "node e2e/mock-api.mjs",
			url: `http://127.0.0.1:${mockApiPort}/health`,
			reuseExistingServer: !process.env.CI,
			env: {
				...process.env,
				MOCK_API_PORT: String(mockApiPort),
			},
		},
		{
			command: `bun run build && bun run start -- --hostname 127.0.0.1 --port ${appPort}`,
			url: baseURL,
			reuseExistingServer: !process.env.CI,
			timeout: 120_000,
			env: {
				...process.env,
				LARAVEL_API_URL: `http://127.0.0.1:${mockApiPort}/api/v1`,
			},
		},
	],
	projects: [
		{
			name: "chromium",
			testIgnore: /responsive\.spec\.ts/,
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "mobile-chromium",
			testMatch: /responsive\.spec\.ts/,
			use: { ...devices["Pixel 7"] },
		},
	],
});
