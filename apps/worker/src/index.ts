export interface WorkerController {
  stop(): Promise<void>;
}

export function startBetaWorker(
  options: { intervalMs?: number; onTick?: () => Promise<void> } = {},
): WorkerController {
  const intervalMs = options.intervalMs ?? 5_000;
  const onTick = options.onTick ?? (async () => undefined);
  const timer = setInterval(() => void onTick(), intervalMs);
  timer.unref();
  return {
    async stop() {
      clearInterval(timer);
    },
  };
}
