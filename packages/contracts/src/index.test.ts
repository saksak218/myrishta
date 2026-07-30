import { describe, expect, it } from "vitest";
import { ErrorResponseSchema } from "./index.js";

describe("API contracts", () => {
  it("accepts stable structured errors", () => {
    expect(
      ErrorResponseSchema.safeParse({
        error: { code: "CONFLICT", message: "Resource changed", requestId: "request-123" },
      }).success,
    ).toBe(true);
  });

  it("rejects unknown machine-readable error codes", () => {
    expect(
      ErrorResponseSchema.safeParse({
        error: { code: "SOMETHING_RANDOM", message: "Error", requestId: "request-123" },
      }).success,
    ).toBe(false);
  });
});
