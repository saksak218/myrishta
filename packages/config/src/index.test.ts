import { describe, expect, it } from "vitest";
import { parsePublicRuntimeConfig } from "./index.js";

describe("runtime configuration", () => {
  it("rejects invalid environment boundaries", () => {
    expect(() =>
      parsePublicRuntimeConfig({
        environment: "preview",
        apiUrl: "nope",
        clerkPublishableKey: "secret",
      }),
    ).toThrow();
  });
});
