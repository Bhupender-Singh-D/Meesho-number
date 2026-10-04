import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPhoneNumber } from "@/lib/crypto";
import { logError } from "@/lib/logger";
import {
  normalizeIndianPhoneNumber,
  INDIAN_MOBILE_REGEX,
  maskPhoneNumber,
  PhoneStatus,
} from "@/lib/validation";

interface BulkCheckResult {
  phone: string;
  maskedPhone: string;
  status: PhoneStatus;
  message?: string;
}

export async function POST(request: NextRequest) {
  // Enforce Authorization: Bearer <server-issued-token>
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "A valid Bearer token is required in the Authorization header to access privileged bulk verification.",
      },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7).trim();
  const validSecret = process.env.API_AUTH_SECRET;

  if (!validSecret || token !== validSecret) {
    return NextResponse.json(
      {
        error: "Forbidden",
        message: "Invalid authorization token.",
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.phones)) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          message: "'phones' must be an array of phone number strings.",
        },
        { status: 400 }
      );
    }

    if (body.phones.length > 50) {
      return NextResponse.json(
        {
          error: "Batch limit exceeded",
          message: "Maximum batch limit is 50 phone numbers per request.",
        },
        { status: 400 }
      );
    }

    const results: BulkCheckResult[] = [];
    const validHashes: { hash: string; index: number; masked: string }[] = [];

    // Pre-validate format and prepare hashes
    for (let i = 0; i < body.phones.length; i++) {
      const raw = String(body.phones[i]);
      const normalized = normalizeIndianPhoneNumber(raw);
      const masked = maskPhoneNumber(normalized || raw);

      if (!INDIAN_MOBILE_REGEX.test(normalized)) {
        results[i] = {
          phone: masked,
          maskedPhone: masked,
          status: "INVALID",
          message: "Invalid Indian mobile number format",
        };
      } else {
        const hash = hashPhoneNumber(normalized);
        validHashes.push({ hash, index: i, masked });
      }
    }

    if (validHashes.length > 0) {
      const hashesToQuery = validHashes.map((v) => v.hash);
      const foundUsers = await prisma.user.findMany({
        where: {
          phoneHash: {
            in: hashesToQuery,
          },
        },
        select: {
          phoneHash: true,
        },
      });

      const foundSet = new Set(foundUsers.map((u) => u.phoneHash));

      for (const item of validHashes) {
        const isRegistered = foundSet.has(item.hash);
        results[item.index] = {
          phone: item.masked,
          maskedPhone: item.masked,
          status: isRegistered ? "REGISTERED" : "NEW",
          message: isRegistered ? "Customer registered" : "Not registered",
        };
      }
    }

    return NextResponse.json({
      success: true,
      totalChecked: results.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logError("POST /api/phone/bulk-check", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
