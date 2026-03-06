import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://38ac93e4931bedd65e20102b24f84282@o4510935921983488.ingest.de.sentry.io/4510935923556432",
  // Enable logs to be sent to Sentry
  enableLogs: true,
});