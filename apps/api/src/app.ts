import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ErrorResponseSchema, HealthResponseSchema } from "@myrishta/contracts";
import { bodyLimit } from "hono/body-limit";
import type { Context, MiddlewareHandler } from "hono";
import type { Logger } from "pino";
import { z } from "zod";
import { ApiError } from "./errors.js";

type Variables = { requestId: string };
type HealthCheck = () => Promise<{ healthy: true; latencyMs: number }>;

export interface AppDependencies {
  logger: Logger;
  healthCheck: HealthCheck;
  rateLimit: number;
  rateWindowMs: number;
  maxBodyBytes: number;
  resolveClientKey?: (context: Context) => string;
  now?: () => number;
}

const errorResponses = {
  400: {
    content: { "application/json": { schema: ErrorResponseSchema } },
    description: "Invalid request",
  },
  429: {
    content: { "application/json": { schema: ErrorResponseSchema } },
    description: "Rate limited",
  },
  500: {
    content: { "application/json": { schema: ErrorResponseSchema } },
    description: "Internal error",
  },
} as const;

export function createApp(deps: AppDependencies) {
  const app = new OpenAPIHono<{ Variables: Variables }>();
  const now = deps.now ?? Date.now;
  const buckets = new Map<string, { count: number; resetsAt: number }>();
  let nextBucketSweepAt = 0;

  const correlation: MiddlewareHandler<{ Variables: Variables }> = async (c, next) => {
    const incoming = c.req.header("x-request-id");
    const requestId =
      incoming && /^[A-Za-z0-9._-]{8,128}$/.test(incoming) ? incoming : crypto.randomUUID();
    c.set("requestId", requestId);
    c.header("x-request-id", requestId);
    const startedAt = performance.now();
    await next();
    deps.logger.info(
      {
        requestId,
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        durationMs: Math.round(performance.now() - startedAt),
      },
      "request completed",
    );
  };

  const rateLimiter: MiddlewareHandler<{ Variables: Variables }> = async (c, next) => {
    const currentTime = now();
    if (currentTime >= nextBucketSweepAt) {
      for (const [key, bucket] of buckets) {
        if (bucket.resetsAt <= currentTime) buckets.delete(key);
      }
      nextBucketSweepAt = currentTime + deps.rateWindowMs;
    }
    const key = deps.resolveClientKey?.(c) || "global";
    const bucket = buckets.get(key);
    const active =
      !bucket || bucket.resetsAt <= currentTime
        ? { count: 0, resetsAt: currentTime + deps.rateWindowMs }
        : bucket;
    active.count += 1;
    buckets.set(key, active);
    c.header("x-ratelimit-limit", String(deps.rateLimit));
    c.header("x-ratelimit-remaining", String(Math.max(0, deps.rateLimit - active.count)));
    c.header("x-ratelimit-reset", String(Math.ceil(active.resetsAt / 1000)));
    if (active.count > deps.rateLimit) throw new ApiError(429, "RATE_LIMITED", "Too many requests");
    await next();
  };

  const idempotency: MiddlewareHandler<{ Variables: Variables }> = async (c, next) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(c.req.method)) {
      const key = c.req.header("idempotency-key");
      if (!key || key.length < 16 || key.length > 128) {
        throw new ApiError(
          400,
          "IDEMPOTENCY_KEY_REQUIRED",
          "A 16-128 character Idempotency-Key header is required",
        );
      }
    }
    await next();
  };

  app.use("*", correlation);
  app.use("/v1/*", rateLimiter);
  app.use(
    "/v1/*",
    bodyLimit({
      maxSize: deps.maxBodyBytes,
      onError: () => {
        throw new ApiError(413, "PAYLOAD_TOO_LARGE", "Request body is too large");
      },
    }),
  );
  app.use("/v1/*", idempotency);

  app.openapi(
    createRoute({
      method: "get",
      path: "/health/live",
      tags: ["Health"],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({ status: z.literal("ok"), requestId: z.string() }),
            },
          },
          description: "Process is alive",
        },
      },
    }),
    (c) => c.json({ status: "ok" as const, requestId: c.get("requestId") }, 200),
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/health/ready",
      tags: ["Health"],
      responses: {
        200: {
          content: { "application/json": { schema: HealthResponseSchema } },
          description: "Service is ready",
        },
        503: {
          content: { "application/json": { schema: HealthResponseSchema } },
          description: "Dependency unavailable",
        },
      },
    }),
    async (c) => {
      try {
        await deps.healthCheck();
        return c.json(
          { status: "ok" as const, database: "up" as const, requestId: c.get("requestId") },
          200,
        );
      } catch (error) {
        deps.logger.error({ error, requestId: c.get("requestId") }, "database health check failed");
        return c.json(
          { status: "degraded" as const, database: "down" as const, requestId: c.get("requestId") },
          503,
        );
      }
    },
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/v1/meta",
      tags: ["Meta"],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({ apiVersion: z.literal("v1"), requestId: z.string() }),
            },
          },
          description: "API metadata",
        },
        ...errorResponses,
      },
    }),
    (c) => c.json({ apiVersion: "v1" as const, requestId: c.get("requestId") }, 200),
  );

  app.doc("/openapi.json", {
    openapi: "3.1.0",
    info: { title: "MyRishta API", version: "1.0.0" },
    servers: [{ url: "/", description: "Current environment" }],
  });

  app.notFound((c) =>
    c.json(
      {
        error: {
          code: "NOT_FOUND" as const,
          message: "Route not found",
          requestId: c.get("requestId"),
        },
      },
      404,
    ),
  );
  app.onError((error, c) => {
    const requestId = c.get("requestId") || crypto.randomUUID();
    if (error instanceof ApiError) {
      return c.json(
        {
          error: {
            code: error.code,
            message: error.message,
            requestId,
            ...(error.details === undefined ? {} : { details: error.details }),
          },
        },
        error.status,
      );
    }
    deps.logger.error({ error, requestId }, "unhandled request error");
    return c.json(
      {
        error: {
          code: "INTERNAL_ERROR" as const,
          message: "An unexpected error occurred",
          requestId,
        },
      },
      500,
    );
  });

  return app;
}
