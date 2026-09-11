# FMI web container

This image uses Bun to install dependencies and build Next.js, then runs the
traced standalone server with Node and PM2. Node is intentionally retained for
the final stage because it is the supported runtime for Next.js standalone
output.

From the project root, build and start the web application with:

```sh
docker compose -f .docker/compose.yml up --build
```

The site is available at <http://localhost:3000>. By default, Laravel is
expected on port `8000` of the Docker host. Copy `.docker/.env.example` to
`.docker/.env` or export the variables before starting Compose to change this.

`NEXT_STANDALONE=true` is passed as a build argument because Next.js reads the
setting while building, not when the container starts. Keep it enabled for this
Docker image. For Vercel or Netlify, leave the variable unset so each platform
can use its normal Next.js build output.

Stop it gracefully with:

```sh
docker compose -f .docker/compose.yml down
```

## PM2 without Docker

Build the standalone output and start the same PM2 configuration locally:

```sh
bun run build
bunx pm2 start .docker/ecosystem.config.cjs
```

Use `bunx pm2 delete fmi-web` to stop the local PM2 process. Keep
`WEB_CONCURRENCY=1` unless the application has a shared Next.js cache and cache
invalidation strategy.
