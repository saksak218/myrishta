import { getTableColumns } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { auditEvents, idempotencyKeys, lifecycleColumns } from "./schema.js";

describe("database conventions", () => {
  it("defines versioned soft-deletion lifecycle columns", () => {
    expect(Object.keys(lifecycleColumns)).toEqual([
      "version",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ]);
  });

  it("records immutable audit and idempotency metadata", () => {
    expect(Object.keys(getTableColumns(auditEvents))).toContain("requestId");
    expect(Object.keys(getTableColumns(idempotencyKeys))).toContain("expiresAt");
  });
});
