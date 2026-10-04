const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

const DEFAULT_SALT =
  process.env.PHONE_HASH_SALT || "c6e7339d2c124806a6b83f3e1b7f94bc41a99a80e1ecfd331c19b626ec17d692";

function hashPhoneNumber(normalizedPhone) {
  return crypto.createHmac("sha256", DEFAULT_SALT).update(normalizedPhone).digest("hex");
}

// Dummy phone numbers for testing (Registered customers)
const DUMMY_REGISTERED_PHONES = [
  "9876543210",
  "9123456780",
  "8888899999",
  "7777712345",
  "6901234567",
  "9000000001",
  "9822334455",
];

async function main() {
  console.log("🌱 Seeding authorized customer database with mock hashed records...");

  for (const phone of DUMMY_REGISTERED_PHONES) {
    const phoneHash = hashPhoneNumber(phone);
    await prisma.user.upsert({
      where: { phoneHash },
      update: {},
      create: {
        phoneHash,
      },
    });
    console.log(`  ✓ Seeded customer (phone ending in ...${phone.slice(-4)})`);
  }

  const count = await prisma.user.count();
  console.log(`✅ Successfully seeded database. Total authorized records: ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
