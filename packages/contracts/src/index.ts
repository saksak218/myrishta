import { z } from "@hono/zod-openapi";

export const ErrorCodeSchema = z
  .enum([
    "VALIDATION_ERROR",
    "IDEMPOTENCY_KEY_REQUIRED",
    "RATE_LIMITED",
    "PAYLOAD_TOO_LARGE",
    "CONFLICT",
    "NOT_FOUND",
    "INTERNAL_ERROR",
    "SERVICE_UNAVAILABLE",
  ])
  .openapi("ErrorCode");

export const ErrorResponseSchema = z
  .object({
    error: z.object({
      code: ErrorCodeSchema,
      message: z.string(),
      requestId: z.string(),
      details: z.unknown().optional(),
    }),
  })
  .openapi("ErrorResponse");

export const HealthResponseSchema = z
  .object({
    status: z.enum(["ok", "degraded"]),
    database: z.enum(["up", "down"]),
    requestId: z.string(),
  })
  .openapi("HealthResponse");

export const VersionHeaderSchema = z.coerce
  .number()
  .int()
  .positive()
  .openapi({
    param: { name: "If-Match", in: "header" },
    example: 1,
  });
