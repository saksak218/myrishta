import { describe, expect, it } from "vitest";
import { tabs } from "./tabs";

describe("mobile tabs", () => {
  it("defines each beta destination exactly once", () => {
    expect(tabs.map(([name]) => name)).toEqual([
      "index",
      "discover",
      "interests",
      "chats",
      "profile",
    ]);
  });
});
