const instances = Number.parseInt(process.env.WEB_CONCURRENCY ?? '1', 10)
const standaloneDirectory =
  process.env.NEXT_STANDALONE_DIR ?? '.next/standalone'

module.exports = {
  apps: [
    {
      name: 'fmi-web',
      script: `${standaloneDirectory}/server.js`,
      interpreter: 'node',
      instances,
      exec_mode: instances > 1 ? 'cluster' : 'fork',
      autorestart: true,
      watch: false,
      kill_timeout: 30_000,
      listen_timeout: 10_000,
      max_memory_restart: process.env.MAX_MEMORY_RESTART ?? '512M',
      env: {
        NODE_ENV: 'production',
        HOSTNAME: process.env.HOSTNAME ?? '0.0.0.0',
        PORT: process.env.PORT ?? '3000',
        NEXT_TELEMETRY_DISABLED: '1',
      },
    },
  ],
}
