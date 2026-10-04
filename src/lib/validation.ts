import { z } from "zod";

/**
 * Normalizes an Indian phone number string by removing formatting, spaces, dashes,
 * and stripping prefixes like +91, 91, or leading 0.
 * Returns a 10-digit clean string if valid format, or the cleaned string.
 */
export function normalizeIndianPhoneNumber(input: string): string {
  if (!input) return "";

  // Remove whitespace, dashes, parens, dots
  let cleaned = input.trim().replace(/[\s\-\(\)\.]+/g, "");

  // Strip international prefix +91 or 91 if it results in a 10-digit number starting with 6-9
  if (cleaned.startsWith("+91")) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith("91") && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith("0") && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Regular expression for standard Indian 10-digit mobile numbers:
 * Starts with 6, 7, 8, or 9 followed by 9 digits.
 */
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export function isValidIndianMobile(phone: string): boolean {
  const normalized = normalizeIndianPhoneNumber(phone);
  return INDIAN_MOBILE_REGEX.test(normalized);
}

/**
 * Mask phone number for secure logging (e.g. "9876543210" -> "+91 ******3210")
 */
export function maskPhoneNumber(phone: string): string {
  const norm = normalizeIndianPhoneNumber(phone);
  if (norm.length === 10) {
    return `+91 ******${norm.slice(-4)}`;
  }
  if (phone.length <= 4) {
    return "****";
  }
  return `****${phone.slice(-4)}`;
}

/**
 * Zod schema for client input validation
 */
export const PhoneCheckInputSchema = z.object({
  phone: z
    .string({
      required_error: "Mobile number is required",
    })
    .min(1, "Mobile number cannot be empty")
    .transform((val) => normalizeIndianPhoneNumber(val))
    .refine((val) => INDIAN_MOBILE_REGEX.test(val), {
      message: "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9",
    }),
});

export type PhoneCheckInput = z.infer<typeof PhoneCheckInputSchema>;

export type PhoneStatus = "REGISTERED" | "NEW" | "INVALID" | "ERROR";

export interface PhoneCheckResponse {
  status: PhoneStatus;
  message?: string;
  maskedPhone?: string;
  timestamp?: string;
}
