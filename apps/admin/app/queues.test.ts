import { describe, expect, it } from "vitest";
import { moderationQueues } from "./queues";

describe("moderation queues", () => {
  it("keeps the safety queue visible to staff", () => {
    expect(moderationQueues).toContain("Safety reports");
    expect(new Set(moderationQueues).size).toBe(moderationQueues.length);
  });
});
