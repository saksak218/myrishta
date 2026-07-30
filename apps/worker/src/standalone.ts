import pino from "pino";
import { startBetaWorker } from "./index.js";

const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });
const worker = startBetaWorker({ onTick: async () => logger.debug("worker heartbeat") });
logger.info("worker started");

async function shutdown() {
  await worker.stop();
  logger.info("worker stopped");
}
process.once("SIGINT", () => void shutdown());
process.once("SIGTERM", () => void shutdown());
