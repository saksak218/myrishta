import pino from "pino";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

function testApp(overrides: Partial<Parameters<typeof createApp>[0]> = {}) {
  return createApp({
    logger: pino({ level: "silent" }),
    healthCheck: async () => ({ healthy: true, latencyMs: 1 }),
    rateLimit: 2,
    rateWindowMs: 60_000,
    maxBodyBytes: 128,
    ...overrides,
  });
}

describe("API foundation", () => {
  it("exposes versioned API metadata and correlation IDs", async () => {
    const response = await testApp().request("/v1/meta", {
      headers: { "x-request-id": "request-12345" },
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("x-request-id")).toBe("request-12345");
    await expect(response.json()).resolves.toMatchObject({
      apiVersion: "v1",
      requestId: "request-12345",
    });
  });

  it("reports database readiness failures without leaking errors", async () => {
    const response = await testApp({
      healthCheck: async () => {
        throw new Error("secret connection detail");
      },
    }).request("/health/ready");
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("secret connection detail");
  });

  it("rate limits v1 requests with a stable error code", async () => {
    const app = testApp();
    await app.request("/v1/meta");
    await app.request("/v1/meta");
    const response = await app.request("/v1/meta");
    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toMatchObject({ error: { code: "RATE_LIMITED" } });
  });

  it("keeps rate limits isolated by the trusted client resolver", async () => {
    const app = testApp({
      resolveClientKey: (context) => context.req.header("x-client") ?? "none",
    });
    await app.request("/v1/meta", { headers: { "x-client": "one" } });
    await app.request("/v1/meta", { headers: { "x-client": "one" } });
    const limited = await app.request("/v1/meta", { headers: { "x-client": "one" } });
    const otherClient = await app.request("/v1/meta", { headers: { "x-client": "two" } });
    expect(limited.status).toBe(429);
    expect(otherClient.status).toBe(200);
  });

  it("requires idempotency keys on unsafe v1 requests", async () => {
    const response = await testApp().request("/v1/unknown", { method: "POST" });
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "IDEMPOTENCY_KEY_REQUIRED" },
    });
  });

  it("rejects oversized request bodies", async () => {
    const response = await testApp().request("/v1/unknown", {
      method: "POST",
      headers: {
        "content-type": "text/plain",
        "content-length": "200",
        "idempotency-key": "idempotency-key-123",
      },
      body: "x".repeat(200),
    });
    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toMatchObject({ error: { code: "PAYLOAD_TOO_LARGE" } });
  });

  it("publishes an OpenAPI 3.1 document", async () => {
    const response = await testApp().request("/openapi.json");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      openapi: "3.1.0",
      info: { version: "1.0.0" },
    });
  });
});
