type LogContext = Record<string, unknown>;

const SENSITIVE_KEYS = new Set(
  [
    "password",
    "passwd",
    "pwd",
    "token",
    "accesstoken",
    "refreshtoken",
    "apikey",
    "api_key",
    "secret",
    "clientsecret",
    "client_secret",
    "authorization",
    "auth",
    "bearer",
    "cookie",
    "session",
    "sessionid",
    "jwt",
    "key",
    "ssn",
    "creditcard",
    "card",
    "cvv",
    "pin",
  ].map((k) => k.toLowerCase()),
);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function redact(value: unknown, depth = 0): unknown {
  if (depth > 5) return "[TRUNCATED]";
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = SENSITIVE_KEYS.has(k.toLowerCase()) ? "[REDACTED]" : redact(v, depth + 1);
    }
    return out;
  }
  return value;
}

function redactCtx(ctx: LogContext): LogContext {
  return redact(ctx) as LogContext;
}

export const logger = {
  info(ctx: LogContext, message: string): void {
    console.info(JSON.stringify({ level: "info", message, ...redactCtx(ctx) }));
  },
  warn(ctx: LogContext, message: string): void {
    console.warn(JSON.stringify({ level: "warn", message, ...redactCtx(ctx) }));
  },
  error(ctx: LogContext, message: string): void {
    console.error(JSON.stringify({ level: "error", message, ...redactCtx(ctx) }));
  },
};
