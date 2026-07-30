import { afterEach, describe, expect, it, vi } from "vitest";
import { startBetaWorker } from "./index.js";

afterEach(() => vi.useRealTimers());

describe("beta worker", () => {
  it("runs on schedule and stops cleanly", async () => {
    vi.useFakeTimers();
    const onTick = vi.fn(async () => undefined);
    const worker = startBetaWorker({ intervalMs: 100, onTick });

    await vi.advanceTimersByTimeAsync(200);
    expect(onTick).toHaveBeenCalledTimes(2);

    await worker.stop();
    await vi.advanceTimersByTimeAsync(100);
    expect(onTick).toHaveBeenCalledTimes(2);
  });
});
