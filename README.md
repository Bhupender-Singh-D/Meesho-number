# Meesho-Style Phone Number Verification System

A production-ready, fully responsive web application and secure API for verifying Indian mobile numbers against an authorized customer database. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.

Designed with **privacy-by-design principles**: phone numbers are never stored in plaintext, HMAC-SHA256 server-side peppering prevents rainbow table attacks, and sliding-window rate limiting prevents bulk enumeration scraping.

---

## 🚀 Key Features

- **Responsive Meesho-Inspired Design**: Clean card-based visual design with brand magenta accents (`#9F2089`), mobile-first responsive layout (mobile, tablet, desktop).
- **Authorized Database Verification**:
  - 🟢 **REGISTERED**: Number already present in the authorized customer database.
  - 🔵 **NEW / NOT REGISTERED**: Valid number format, eligible for new registration.
  - 🔴 **INVALID NUMBER**: Does not meet Indian mobile specifications (10 digits starting with 6, 7, 8, or 9).
  - 🟠 **ERROR / RATE LIMITED**: Protected against abuse and brute-force scans.
- **Strict Indian Mobile Validation**: Automatically strips `+91`, `91`, or leading `0`, validates `^[6-9]\d{9}$` using Zod and React Hook Form.
- **Zero Plaintext Storage & HMAC-SHA256 Pepper Hashing**:
  - Phone numbers are normalized and hashed using `crypto.createHmac("sha256", process.env.PHONE_HASH_SALT)`.
  - Database stores only unique `phoneHash`. Even in the event of an unauthorized database dump, reverse lookup of 10-digit spaces is computationally infeasible without the server salt.
- **Abuse & Scraping Protection**:
  - Sliding-window IP rate limiting (configurable via `.env`).
  - Safe audit logs: Phone numbers are masked (`+91 ******3210`) in logs and response headers.
- **Privileged Bulk-Check API**: Supports `Authorization: Bearer <server-issued-token>` for bulk verification up to 50 numbers at a time.
- **Seeded Dummy Data**: Comes pre-populated with mock customer numbers for immediate end-to-end testing without touching real Meesho accounts.

---

## 📁 Architecture & Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide React, React Hook Form, `@hookform/resolvers/zod`, Zod.
- **Backend**: Next.js App Router API Routes (`/api/phone/check`, `/api/phone/bulk-check`).
- **Database / ORM**: Prisma ORM with SQLite for zero-setup local execution (seamlessly switchable to PostgreSQL via `prisma/schema.postgresql.prisma`).
- **Security**: HMAC-SHA256 peppered hashing, IP sliding-window rate limiter, Bearer token authentication for bulk checks, masked audit logging.

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js** 18+ (tested on Node v24)
- **npm** or **yarn**

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` (already pre-configured for local testing):
```bash
cp .env.example .env
```

Key environment variables:
```env
# Database connection (SQLite default for zero-setup local dev)
DATABASE_URL="file:./dev.db"

# Server-side secret pepper for HMAC-SHA256 phone hashing
PHONE_HASH_SALT="c6e7339d2c124806a6b83f3e1b7f94bc41a99a80e1ecfd331c19b626ec17d692"

# Token for privileged / bulk checking endpoints
API_AUTH_SECRET="meesho_secure_verifier_token_2026_xyz"

# Rate limiting settings (abuse protection)
RATE_LIMIT_MAX_REQUESTS="20"
RATE_LIMIT_WINDOW_MS="60000"
```

### 4. Database Setup & Seeding
Generate the Prisma Client, create the database schema, and seed dummy customer records:
```bash
# Generate Prisma Client
npx prisma generate

# Create SQLite database (or sync Postgres)
npx prisma db push

# Seed mock authorized customer records
node prisma/seed.js
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Quick Test Data

The database is seeded with the following mock records:

| Mobile Number | Expected Status | Description |
| :--- | :--- | :--- |
| `9876543210` | 🟢 **REGISTERED** | Mock existing customer in authorized database |
| `8888899999` | 🟢 **REGISTERED** | Mock existing customer in authorized database |
| `9123456780` | 🟢 **REGISTERED** | Mock existing customer in authorized database |
| `7777712345` | 🟢 **REGISTERED** | Mock existing customer in authorized database |
| `9999912345` | 🔵 **NEW** | Valid format, not yet registered |
| `9001234567` | 🔵 **NEW** | Valid format, not yet registered |
| `5555512345` | 🔴 **INVALID** | Does not start with 6, 7, 8, or 9 |
| `12345` | 🔴 **INVALID** | Less than 10 digits |

---

## 📡 API Reference

### 1. Single Phone Check
**`POST /api/phone/check`**

#### Request Header:
```http
Content-Type: application/json
```

#### Request Body:
```json
{
  "phone": "9876543210"
}
```

#### Response (Registered):
```json
{
  "status": "REGISTERED",
  "message": "Mobile number is already registered in the authorized customer database.",
  "maskedPhone": "+91 ******3210",
  "timestamp": "2026-10-04T17:30:00.000Z"
}
```

#### Response (New / Unregistered):
```json
{
  "status": "NEW",
  "message": "Mobile number is new and not currently registered in the database.",
  "maskedPhone": "+91 ******1234",
  "timestamp": "2026-10-04T17:30:00.000Z"
}
```

#### Response (Invalid Number):
```json
{
  "status": "INVALID",
  "message": "Invalid Indian mobile number format. Number must be 10 digits starting with 6, 7, 8, or 9.",
  "maskedPhone": "+91 ******5555",
  "timestamp": "2026-10-04T17:30:00.000Z"
}
```

---

### 2. Privileged Bulk Verification API
**`POST /api/phone/bulk-check`**

Requires `Authorization: Bearer <API_AUTH_SECRET>` header. Supports batches up to 50 numbers.

#### Request Headers:
```http
Content-Type: application/json
Authorization: Bearer meesho_secure_verifier_token_2026_xyz
```

#### Request Body:
```json
{
  "phones": ["9876543210", "9999912345", "5555512345"]
}
```

#### Response:
```json
{
  "success": true,
  "totalChecked": 3,
  "results": [
    {
      "phone": "+91 ******3210",
      "maskedPhone": "+91 ******3210",
      "status": "REGISTERED",
      "message": "Customer registered"
    },
    {
      "phone": "+91 ******2345",
      "maskedPhone": "+91 ******2345",
      "status": "NEW",
      "message": "Not registered"
    },
    {
      "phone": "****2345",
      "maskedPhone": "****2345",
      "status": "INVALID",
      "message": "Invalid Indian mobile number format"
    }
  ],
  "timestamp": "2026-10-04T17:30:00.000Z"
}
```

---

## 🐘 Switching to PostgreSQL

To connect to a production PostgreSQL database:
1. In `.env`, change `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/meesho_verifier?schema=public"
   ```
2. In `prisma/schema.prisma`, update provider to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   *(Or copy `prisma/schema.postgresql.prisma` over `prisma/schema.prisma`)*
3. Run `npx prisma db push && node prisma/seed.js`.

---

## 🔒 Security & Privacy Guarantees

1. **No External Scraping / Enumeration**: Does not intercept, scrape, reverse-engineer, or query live Meesho systems. Uses strictly authorized customer databases.
2. **Zero Plaintext Storage**: Only HMAC-SHA256 salted hashes are persisted.
3. **Audit Log Sanitization**: Full phone numbers are automatically sanitized and masked (`+91 ******XXXX`) prior to logging.
4. **Sliding-Window IP Rate Limiting**: Throttles suspicious rapid-fire requests to prevent brute force phone enumeration.
