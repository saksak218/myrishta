import pino from "pino";

export function createLogger(level: string) {
  return pino({
    level,
    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "req.headers['idempotency-key']",
        "password",
        "token",
        "phone",
        "email",
        "message",
        "mediaUrl",
      ],
      censor: "[REDACTED]",
    },
  });
}
