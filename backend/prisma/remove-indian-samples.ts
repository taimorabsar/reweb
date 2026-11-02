import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TITLES_TO_REMOVE = [
  "Spacious 3BHK Apartment in Indiranagar",
  "Luxury Villa with Private Pool in Whitefield",
  "Modern 2BHK in Koramangala",
  "Premium Office Space in MG Road",
  "Plot in Sarjapur Road - Great Investment",
  "Cozy 1BHK near HSR Layout",
  "Independent House in JP Nagar",
  "Sea-Facing 2BHK in Mumbai Andheri",
  "4BHK Penthouse in Powai",
  "Residential Plot in Chennai OMR",
  "Furnished 3BHK in Hyderabad Gachibowli",
];

const OWNER_EMAIL = "balakrishna@test.com";

async function main() {
  const confirmDelete = process.argv.includes("--delete");

  const owner = await prisma.user.findUnique({ where: { email: OWNER_EMAIL } });
  if (!owner) {
    console.log(`Account ${OWNER_EMAIL} not found. Nothing to do.`);
    return;
  }

  const matches = await prisma.property.findMany({
    where: { userId: owner.id, title: { in: TITLES_TO_REMOVE } },
    select: { id: true, title: true, city: true, purpose: true },
  });

  console.log(`Found ${matches.length} listing(s) matching the original Indian samples:`);
  for (const m of matches) {
    console.log(`  - ${m.title} (${m.city}, ${m.purpose})`);
  }

  if (!confirmDelete) {
    console.log("\nPREVIEW ONLY. Nothing was deleted.");
    console.log("To delete these, run the same command with --delete at the end.");
    return;
  }

  const result = await prisma.property.deleteMany({
    where: { id: { in: matches.map((m) => m.id) } },
  });
  console.log(`\nDeleted ${result.count} listing(s).`);
  console.log(`Listings remaining: ${await prisma.property.count()}`);
}

main()
  .catch((e) => {
    console.error("Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });