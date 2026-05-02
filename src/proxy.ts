import type { NextRequest } from "next/server";
import { updateSession } from "@/infrastructure/supabase/proxy";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(name, value);
  }
  return response;
}

export const config = {
  // Skip static assets and webhook endpoints; webhooks must not trigger session refresh
  // because they arrive without user cookies.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|bmp|woff|woff2|ttf|otf|eot|mp4|webm|ogg|mp3|wav|flac)$).*)",
  ],
};
