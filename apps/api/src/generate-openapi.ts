import { writeFile } from "node:fs/promises";
import { createApp } from "./app.js";
import { createLogger } from "./logger.js";

const app = createApp({
  logger: createLogger("silent"),
  healthCheck: async () => ({ healthy: true, latencyMs: 0 }),
  rateLimit: 100,
  rateWindowMs: 60_000,
  maxBodyBytes: 1_048_576,
});
const response = await app.request("/openapi.json");
if (!response.ok) throw new Error(`OpenAPI generation failed: ${response.status}`);
await writeFile(
  "../../openapi.json",
  `${JSON.stringify(await response.json(), null, 2)}\n`,
  "utf8",
);
