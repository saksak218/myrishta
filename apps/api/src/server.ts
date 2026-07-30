import { serve } from "@hono/node-server";
import { getConnInfo } from "@hono/node-server/conninfo";
import { createDatabase } from "@myrishta/db";
import { createApp } from "./app.js";
import { parseEnvironment } from "./env.js";
import { createLogger } from "./logger.js";

const env = parseEnvironment(process.env);
const logger = createLogger(env.LOG_LEVEL);
const database = createDatabase(env.DATABASE_URL);
const app = createApp({
  logger,
  healthCheck: database.healthCheck,
  rateLimit: env.API_RATE_LIMIT,
  rateWindowMs: env.API_RATE_WINDOW_MS,
  maxBodyBytes: env.API_MAX_BODY_BYTES,
  resolveClientKey: (context) => {
    if (env.TRUST_PROXY) {
      return context.req.header("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    }
    return getConnInfo(context).remote.address ?? "unknown";
  },
});

const server = serve({ fetch: app.fetch, port: env.PORT }, ({ port }) =>
  logger.info({ port }, "API listening"),
);

async function shutdown(signal: string) {
  logger.info({ signal }, "shutting down");
  server.close();
  await database.close();
}
process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
