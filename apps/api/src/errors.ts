import type { ErrorCodeSchema } from "@myrishta/contracts";
import type { z } from "zod";

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

export class ApiError extends Error {
  constructor(
    public readonly status: 400 | 404 | 409 | 413 | 429 | 503,
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
