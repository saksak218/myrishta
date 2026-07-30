import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  API_RATE_LIMIT: z.coerce.number().int().positive().default(100),
  API_RATE_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  API_MAX_BODY_BYTES: z.coerce.number().int().positive().default(1_048_576),
  TRUST_PROXY: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

export type ApiEnvironment = z.infer<typeof EnvSchema>;
export function parseEnvironment(input: NodeJS.ProcessEnv): ApiEnvironment {
  return EnvSchema.parse(input);
}
