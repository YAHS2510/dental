interface RateLimitRecord {
  timestamps: number[];
}

// In-memory token bucket / sliding-window tracking store
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale IP entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, ip) => {
      // Remove timestamps older than 5 minutes
      const validTimestamps = record.timestamps.filter(
        (ts) => now - ts < 300000
      );
      if (validTimestamps.length === 0) {
        rateLimitStore.delete(ip);
      } else {
        record.timestamps = validTimestamps;
      }
    });
  }, 300000);
}

export interface RateLimitOptions {
  limit?: number; // Max requests allowed
  windowMs?: number; // Time window in milliseconds (e.g. 60000 for 1 minute)
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Extracts client IP from standard request headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Checks sliding-window rate limit for a client IP.
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit ?? 5; // 5 requests
  const windowMs = options.windowMs ?? 60000; // per 60 seconds
  const now = Date.now();

  const record = rateLimitStore.get(identifier) || { timestamps: [] };

  // Filter out timestamps outside the active window
  const activeTimestamps = record.timestamps.filter(
    (ts) => now - ts < windowMs
  );

  if (activeTimestamps.length >= limit) {
    const oldestTimestamp = activeTimestamps[0];
    const resetSeconds = Math.max(
      1,
      Math.ceil((oldestTimestamp + windowMs - now) / 1000)
    );

    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds,
    };
  }

  activeTimestamps.push(now);
  rateLimitStore.set(identifier, { timestamps: activeTimestamps });

  const resetSeconds = Math.ceil(windowMs / 1000);

  return {
    success: true,
    limit,
    remaining: limit - activeTimestamps.length,
    resetSeconds,
  };
}
