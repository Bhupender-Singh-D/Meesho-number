import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPhoneNumber } from "@/lib/crypto";
import { checkRateLimit } from "@/lib/rateLimit";
import { logPhoneCheck, logError } from "@/lib/logger";
import {
  normalizeIndianPhoneNumber,
  INDIAN_MOBILE_REGEX,
  maskPhoneNumber,
  PhoneCheckResponse,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // Extract client IP address for rate limiting
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const clientIp = forwardedFor?.split(",")[0].trim() || realIp || "127.0.0.1";

  // Check rate limit (abuse protection)
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    const retryAfterSec = Math.ceil(rateLimit.resetMs / 1000);
    return NextResponse.json<PhoneCheckResponse>(
      {
        status: "ERROR",
        message: `Too many requests from this IP. Please wait ${retryAfterSec} seconds before trying again.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfterSec.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // Check optional Bearer token authentication for privileged requests
  const authHeader = request.headers.get("authorization");
  let isPrivileged = false;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token === process.env.API_AUTH_SECRET) {
      isPrivileged = true;
    }
  }

  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.phone !== "string") {
      return NextResponse.json<PhoneCheckResponse>(
        {
          status: "INVALID",
          message: "A valid 'phone' string is required in the JSON body.",
        },
        { status: 400 }
      );
    }

    const rawPhone = body.phone;
    const normalizedPhone = normalizeIndianPhoneNumber(rawPhone);

    // Validate Indian mobile format: 10 digits starting with 6, 7, 8, 9
    if (!INDIAN_MOBILE_REGEX.test(normalizedPhone)) {
      logPhoneCheck(clientIp, rawPhone, "INVALID", Date.now() - startTime);
      return NextResponse.json<PhoneCheckResponse>(
        {
          status: "INVALID",
          message:
            "Invalid Indian mobile number format. Number must be 10 digits starting with 6, 7, 8, or 9.",
          maskedPhone: maskPhoneNumber(normalizedPhone || rawPhone),
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Compute HMAC-SHA256 hash using server-side pepper/salt
    const phoneHash = hashPhoneNumber(normalizedPhone);

    // Query authorized customer database
    const existingUser = await prisma.user.findUnique({
      where: { phoneHash },
      select: { id: true, createdAt: true },
    });

    const status = existingUser ? "REGISTERED" : "NEW";
    const duration = Date.now() - startTime;
    logPhoneCheck(clientIp, normalizedPhone, status, duration);

    return NextResponse.json<PhoneCheckResponse>(
      {
        status,
        message:
          status === "REGISTERED"
            ? "Mobile number is already registered in the authorized customer database."
            : "Mobile number is new and not currently registered in the database.",
        maskedPhone: maskPhoneNumber(normalizedPhone),
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    logError("POST /api/phone/check", error);
    return NextResponse.json<PhoneCheckResponse>(
      {
        status: "ERROR",
        message: "An internal server error occurred while verifying the number. Please try again.",
      },
      { status: 500 }
    );
  }
}
