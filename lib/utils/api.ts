import { NextResponse, type NextRequest } from "next/server";

/**
 * Validate that the request origin matches allowed domains.
 * Returns the validated origin or null if invalid.
 */
const ALLOWED_ORIGINS = [
  "https://bugproof.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

export function getValidatedOrigin(req: NextRequest): string {
  const origin = req.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed))) {
    return origin;
  }
  return "https://bugproof.vercel.app";
}

/**
 * Simple in-memory rate limiter (per-process).
 * For production at scale, use Redis or Vercel's edge rate limiting.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

// Periodically clean up expired entries (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Return a generic error response without leaking internal details.
 */
export function errorResponse(publicMessage: string, status: number) {
  return NextResponse.json({ error: publicMessage }, { status });
}

/**
 * Safely parse JSON from a request body. Returns null on failure.
 */
export async function safeParseJSON(request: Request): Promise<Record<string, unknown> | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
