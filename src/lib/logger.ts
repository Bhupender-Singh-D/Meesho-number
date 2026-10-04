import { maskPhoneNumber } from "./validation";

export function logPhoneCheck(
  ip: string,
  rawOrNormalizedPhone: string,
  status: string,
  durationMs: number
) {
  const masked = maskPhoneNumber(rawOrNormalizedPhone);
  const timestamp = new Date().toISOString();
  // Safe sanitized log entry without full phone number
  console.log(
    `[${timestamp}] [AUDIT] IP=${ip} PHONE=${masked} STATUS=${status} DURATION=${durationMs}ms`
  );
}

export function logError(context: string, error: unknown) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [ERROR] [${context}]`, error);
}
