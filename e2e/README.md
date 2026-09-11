# End-to-end tests

The Playwright suite starts the real Next.js application and a local mock of the
Laravel API. Tests are repeatable and do not create, upload, or delete data in a
developer database.

Run the suite with:

```sh
bun run test:e2e
```

For an interactive browser runner or step-by-step debugging:

```sh
bun run test:e2e:ui
bun run test:e2e:debug
```

Install Chromium again after a clean dependency install with:

```sh
bun run test:e2e:install
```
