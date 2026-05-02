import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/shared/errors/app-error";
import { logger } from "./logger";

type ZodFlatten = ReturnType<ZodError["flatten"]>;

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

export function created<T>(data: T): NextResponse {
  return NextResponse.json({ data }, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function fail(status: number, message: string, details?: ZodFlatten): NextResponse {
  return NextResponse.json({ error: { message, details } }, { status });
}

export function badRequest(error: ZodError | string = "Bad request"): NextResponse {
  if (error instanceof ZodError) {
    return fail(400, "Validation failed", error.flatten());
  }
  return fail(400, error);
}

export function unauthorized(message = "Unauthorized"): NextResponse {
  return fail(401, message);
}

export function forbidden(message = "Forbidden"): NextResponse {
  return fail(403, message);
}

export function notFound(message = "Not found"): NextResponse {
  return fail(404, message);
}

export function handleError(e: unknown): NextResponse {
  if (e instanceof AppError) {
    return fail(e.statusCode, e.message);
  }
  if (e instanceof ZodError) {
    return fail(400, "Validation failed", e.flatten());
  }
  // Never echo raw error messages — Postgres / SDK errors often embed PII or schema details
  const errName = e instanceof Error ? e.name : "UnknownError";
  logger.error({ errName }, "unhandled error");
  return fail(500, "Internal server error");
}
