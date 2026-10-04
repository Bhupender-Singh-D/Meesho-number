interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window rate limiter
const ipRequestMap = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);
    for (const [ip, record] of ipRequestMap.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
      if (record.timestamps.length === 0) {
        ipRequestMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

/**
 * Check if the given client IP has exceeded the rate limit.
 * Defaults to 20 requests per 60 seconds per IP.
 */
export function checkRateLimit(clientIp: string): RateLimitResult {
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "20", 10);
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);
  const now = Date.now();

  let record = ipRequestMap.get(clientIp);
  if (!record) {
    record = { timestamps: [] };
    ipRequestMap.set(clientIp, record);
  }

  // Filter timestamps outside current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldestTimestamp));
    return {
      allowed: false,
      remaining: 0,
      resetMs,
    };
  }

  // Record this request
  record.timestamps.push(now);
  const remaining = maxRequests - record.timestamps.length;
  const resetMs = windowMs;

  return {
    allowed: true,
    remaining,
    resetMs,
  };
}
