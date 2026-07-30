import { describe, expect, it } from "vitest";
import { isAdultOn } from "./index.js";

describe("candidate age", () => {
  it("requires the eighteenth birthday to have occurred", () => {
    const today = new Date("2026-07-29T00:00:00Z");
    expect(isAdultOn(new Date("2008-07-29T00:00:00Z"), today)).toBe(true);
    expect(isAdultOn(new Date("2008-07-30T00:00:00Z"), today)).toBe(false);
  });
});
