# FMI Web

FMI Web is the Next.js frontend for the Face Media Index platform. It lets
users create galleries, upload images, monitor face processing, preview and
share images, and search for visually similar faces inside a selected gallery.

## Features

- Account registration, login, logout, and protected pages
- Gallery creation, filtering, sorting, sharing, and deletion
- Responsive drag-and-drop image uploads with storage quota feedback
- Image previews, processing state, reprocessing, and deletion
- Gallery-scoped face similarity search
- Light, dark, and system themes
- Responsive desktop and mobile layouts
- Mock-backed Playwright end-to-end tests

## Technology

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- React Hook Form and Zod
- Motion for interface animation
- Biome and ESLint for code quality
- Playwright for end-to-end testing
- Bun for package management and builds

## How it connects to Laravel

The browser talks to Next.js session and backend proxy routes. Next.js stores
the Laravel Sanctum token in an HttpOnly cookie and forwards authenticated API
requests to Laravel.

```text
Browser → FMI Web → Laravel API → queue → FMI Image Processor
                              ↘ PostgreSQL + pgvector
```

The Laravel API URL is server-side configuration and is not exposed as a
`NEXT_PUBLIC_` variable.

## Requirements

- Bun 1.3 or newer
- The FMI Laravel API running locally or at an accessible URL
- Docker Desktop or Docker Engine with Compose, if using the container setup

## Local setup

```sh
git clone <repository-url> fmi-web
cd fmi-web
cp .env.example .env.local
bun install --frozen-lockfile
bun run dev
```

The application is available at <http://localhost:3000>.

Configure the Laravel API in `.env.local`:

```dotenv
LARAVEL_API_URL=http://127.0.0.1:8000/api/v1
```

Restart the Next.js development server after changing environment variables.

## Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the development server |
| `bun run build` | Create a production build |
| `bun run start` | Run a regular production build |
| `bun run typecheck` | Check TypeScript types |
| `bun run lint` | Run ESLint and Biome linting |
| `bun run format` | Format the project with Biome |
| `bun run check` | Check formatting, linting, and imports |
| `bun run test:e2e` | Run the Playwright browser suite |
| `bun run test:e2e:ui` | Open the Playwright interactive runner |

## End-to-end tests

The Playwright suite starts the real Next.js application against a deterministic
mock Laravel API. It does not create users, galleries, or images in a developer
database.

Install the browser once, then run the suite:

```sh
bun run test:e2e:install
bun run test:e2e
```

See [e2e/README.md](e2e/README.md) for interactive and debugging commands.

## Docker and PM2

The Docker image uses Bun to install dependencies and build Next.js. It then
runs the traced Next.js standalone server with Node and PM2 as a non-root user.

```sh
docker compose -f .docker/compose.yml up --build
```

By default, the container expects Laravel at
`http://host.docker.internal:8000/api/v1` and exposes FMI Web at
<http://localhost:3000>.

Copy `.docker/.env.example` to `.docker/.env` to customize ports, the Laravel
URL, PM2 memory limits, or worker count. Keep `NEXT_STANDALONE=true` for Docker;
leave it unset on Vercel or Netlify so the platform can select its normal build
output.

```sh
docker compose -f .docker/compose.yml down
```

More detail is available in [.docker/README.md](.docker/README.md).

## AI disclosure

This README was created with AI assistance. Verify deployment values, secrets,
and environment-specific instructions against the current project configuration
before using them in production.
