import crypto from "crypto";

const DEFAULT_SALT = "meesho_secure_hmac_default_salt_2026_xyz";

/**
 * Computes a secure HMAC-SHA256 hash of a normalized phone number.
 * Uses a server-side pepper/salt (PHONE_HASH_SALT env var) to resist
 * precomputed dictionary/rainbow table attacks on 10-digit phone spaces.
 */
export function hashPhoneNumber(normalizedPhone: string): string {
  const salt = process.env.PHONE_HASH_SALT || DEFAULT_SALT;
  return crypto
    .createHmac("sha256", salt)
    .update(normalizedPhone)
    .digest("hex");
}
