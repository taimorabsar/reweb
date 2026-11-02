import {
  PrismaClient,
  Prisma,
  PropertyType,
  PropertyStatus,
  ListingPurpose,
  AccountType,
  Furnishing,
  Possession,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type Seller = "owner" | "agent" | "agency";
type Listing = Omit<Prisma.PropertyUncheckedCreateInput, "userId"> & { seller: Seller };

const u = (id: string) => `https://images.unsplash.com/${id}?w=800`;

const APARTMENT_IMAGES = [
  u("photo-1560448204-e02f11c3d0e2"),
  u("photo-1502672260266-1c1ef2d93688"),
  u("photo-1560185007-cde436f6a4d0"),
];
const APARTMENT_IMAGES_2 = [u("photo-1522708323590-d24dbb6b0267"), u("photo-1560448204-e02f11c3d0e2")];
const HOUSE_IMAGES = [
  u("photo-1613490493576-7fde63acd811"),
  u("photo-1600596542815-ffad4c1539a9"),
  u("photo-1600585154340-be6161a56a0c"),
];
const PLOT_IMAGES = [u("photo-1500382017468-9049fed747ef"), u("photo-1628624747186-a941c476b7ef")];
const COMMERCIAL_IMAGES = [u("photo-1497366216548-37526070297c"), u("photo-1486406146926-c627a92ad1ab")];

const listings: Listing[] = [
  {
    seller: "agency",
    title: "3 Bedroom Apartment in DHA Phase 6",
    description:
      "Bright 3 bedroom apartment on a high floor with a sea breeze balcony. Open kitchen, lounge with a large window, and two covered parking spaces. Building has a lift, security and backup power.",
    price: 48500000,
    city: "Karachi",
    locality: "DHA Phase 6",
    propertyType: PropertyType.APARTMENT,
    purpose: ListingPurpose.SALE,
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2100,
    yearBuilt: 2019,
    parkingSpaces: 2,
    furnishing: Furnishing.UNFURNISHED,
    possession: Possession.READY,
    features: ["ELEVATOR", "SECURITY", "BACKUP_POWER", "GAS", "ELECTRICITY", "WATER_SUPPLY", "BALCONY"],
    images: APARTMENT_IMAGES,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "agent",
    title: "Furnished 2 Bedroom Apartment for Rent in Clifton",
    description:
      "Fully furnished 2 bedroom apartment close to shops and restaurants. Split air conditioners, fitted kitchen and a covered parking space. Suitable for a small family or working professionals.",
    price: 150000,
    city: "Karachi",
    locality: "Clifton Block 5",
    propertyType: PropertyType.APARTMENT,
    purpose: ListingPurpose.RENT,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1300,
    yearBuilt: 2016,
    parkingSpaces: 1,
    furnishing: Furnishing.FURNISHED,
    possession: Possession.READY,
    features: ["ELEVATOR", "SECURITY", "BACKUP_POWER", "GAS", "ELECTRICITY", "WATER_SUPPLY"],
    images: APARTMENT_IMAGES_2,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "owner",
    title: "Ground Floor Shop on Main Road, Gulshan-e-Iqbal",
    description:
      "Ground floor shop on a busy main road with strong foot traffic. Currently rented to a long-term tenant, a good option for steady monthly income. Clear paperwork available on request.",
    price: 32000000,
    city: "Karachi",
    locality: "Gulshan-e-Iqbal",
    propertyType: PropertyType.COMMERCIAL,
    purpose: ListingPurpose.SALE,
    isInvestment: true,
    bedrooms: 0,
    bathrooms: 1,
    areaSqFt: 800,
    yearBuilt: 2008,
    floors: 1,
    possession: Possession.READY,
    features: ["ELECTRICITY", "WATER_SUPPLY", "SECURITY"],
    images: COMMERCIAL_IMAGES,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "agency",
    title: "1 Kanal House in DHA Phase 5",
    description:
      "Spacious 5 bedroom house with a lawn, servant quarter and a separate drawing and dining area. Well kept, wide road, quiet street. Ready to move in, with room for four cars.",
    price: 195000000,
    city: "Lahore",
    locality: "DHA Phase 5",
    propertyType: PropertyType.HOUSE,
    purpose: ListingPurpose.SALE,
    bedrooms: 5,
    bathrooms: 6,
    areaSqFt: 4500,
    yearBuilt: 2014,
    floors: 2,
    parkingSpaces: 4,
    furnishing: Furnishing.UNFURNISHED,
    possession: Possession.READY,
    features: ["GAS", "ELECTRICITY", "WATER_SUPPLY", "BOUNDARY_WALL", "SERVANT_QUARTER", "LAWN", "SECURITY", "BACKUP_POWER"],
    images: HOUSE_IMAGES,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "agent",
    title: "Office Floor for Rent in Gulberg III",
    description:
      "Open plan office floor with meeting rooms, a pantry and reception area. Central location with easy access to the main boulevard. Lift, parking and backup power available in the building.",
    price: 450000,
    city: "Lahore",
    locality: "Gulberg III",
    propertyType: PropertyType.COMMERCIAL,
    purpose: ListingPurpose.RENT,
    bedrooms: 0,
    bathrooms: 2,
    areaSqFt: 2400,
    yearBuilt: 2012,
    floors: 1,
    parkingSpaces: 6,
    furnishing: Furnishing.SEMI_FURNISHED,
    possession: Possession.READY,
    features: ["ELEVATOR", "SECURITY", "BACKUP_POWER", "ELECTRICITY", "WATER_SUPPLY"],
    images: COMMERCIAL_IMAGES,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "owner",
    title: "10 Marla Residential Plot in Bahria Town",
    description:
      "Level residential plot in a developed block, close to the main entrance and a park. A solid choice for building a home or holding as a long-term investment.",
    price: 14500000,
    city: "Lahore",
    locality: "Bahria Town",
    propertyType: PropertyType.PLOT,
    purpose: ListingPurpose.SALE,
    isInvestment: true,
    bedrooms: 0,
    bathrooms: 0,
    areaSqFt: 2250,
    possession: Possession.READY,
    features: ["ELECTRICITY", "WATER_SUPPLY", "GAS", "SECURITY"],
    images: PLOT_IMAGES,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "agency",
    title: "3 Bedroom Apartment in F-11, Islamabad",
    description:
      "Well-planned 3 bedroom apartment with a bright lounge, two balconies and ample storage. Building has a lift, covered parking and round-the-clock security.",
    price: 52000000,
    city: "Islamabad",
    locality: "F-11",
    propertyType: PropertyType.APARTMENT,
    purpose: ListingPurpose.SALE,
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1650,
    yearBuilt: 2021,
    parkingSpaces: 2,
    furnishing: Furnishing.SEMI_FURNISHED,
    possession: Possession.READY,
    features: ["ELEVATOR", "SECURITY", "BACKUP_POWER", "BALCONY", "GAS", "ELECTRICITY", "WATER_SUPPLY"],
    images: APARTMENT_IMAGES,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "owner",
    title: "4 Bedroom House for Rent in E-11",
    description:
      "Double storey house with a front lawn, drawing room and separate servant quarter. Quiet street near markets and schools. Suitable for a family or a small office.",
    price: 280000,
    city: "Islamabad",
    locality: "E-11",
    propertyType: PropertyType.HOUSE,
    purpose: ListingPurpose.RENT,
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 3150,
    yearBuilt: 2010,
    floors: 2,
    parkingSpaces: 3,
    furnishing: Furnishing.UNFURNISHED,
    possession: Possession.READY,
    features: ["GAS", "ELECTRICITY", "WATER_SUPPLY", "LAWN", "SERVANT_QUARTER", "BOUNDARY_WALL"],
    images: HOUSE_IMAGES,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "agent",
    title: "1 Kanal Plot in DHA Phase 2",
    description:
      "Corner 1 kanal plot on a wide road, in a developed area with all utilities nearby. Good for a large family home or a long-term holding.",
    price: 60000000,
    city: "Islamabad",
    locality: "DHA Phase 2",
    propertyType: PropertyType.PLOT,
    purpose: ListingPurpose.SALE,
    isInvestment: true,
    bedrooms: 0,
    bathrooms: 0,
    areaSqFt: 4500,
    possession: Possession.READY,
    features: ["ELECTRICITY", "WATER_SUPPLY", "GAS", "SECURITY"],
    images: PLOT_IMAGES,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "agency",
    title: "Modern Villa in Bahria Town Phase 8",
    description:
      "5 bedroom villa with a private garden, double height lounge and modern kitchen. Close to the commercial area and the main road. Gated community with 24 hour security.",
    price: 68000000,
    city: "Rawalpindi",
    locality: "Bahria Town Phase 8",
    propertyType: PropertyType.VILLA,
    purpose: ListingPurpose.SALE,
    bedrooms: 5,
    bathrooms: 5,
    areaSqFt: 3150,
    yearBuilt: 2022,
    floors: 2,
    parkingSpaces: 3,
    furnishing: Furnishing.UNFURNISHED,
    possession: Possession.READY,
    features: ["GAS", "ELECTRICITY", "WATER_SUPPLY", "LAWN", "SECURITY", "BACKUP_POWER", "BALCONY"],
    images: HOUSE_IMAGES,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "owner",
    title: "5 Marla House in Madina Town",
    description:
      "Neat 3 bedroom house on a 5 marla plot, close to the main road and local markets. Tiled floors, fitted kitchen and a small front porch. Ready for family use.",
    price: 12500000,
    city: "Faisalabad",
    locality: "Madina Town",
    propertyType: PropertyType.HOUSE,
    purpose: ListingPurpose.SALE,
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1125,
    yearBuilt: 2017,
    floors: 2,
    parkingSpaces: 1,
    possession: Possession.READY,
    features: ["GAS", "ELECTRICITY", "WATER_SUPPLY", "BOUNDARY_WALL"],
    images: HOUSE_IMAGES,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "agent",
    title: "Family House for Rent in Gulgasht Colony",
    description:
      "3 bedroom house with a drawing room, lounge and a small lawn. Peaceful neighbourhood near schools and a hospital. Available for a long term family tenant.",
    price: 65000,
    city: "Multan",
    locality: "Gulgasht Colony",
    propertyType: PropertyType.HOUSE,
    purpose: ListingPurpose.RENT,
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2250,
    yearBuilt: 2013,
    floors: 1,
    parkingSpaces: 2,
    furnishing: Furnishing.UNFURNISHED,
    possession: Possession.READY,
    features: ["GAS", "ELECTRICITY", "WATER_SUPPLY", "LAWN", "BOUNDARY_WALL"],
    images: HOUSE_IMAGES,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "agency",
    title: "4 Bedroom House in Hayatabad Phase 3",
    description:
      "Spacious double storey house in a well-established sector. Large lounge, 4 bedrooms with attached bathrooms and a covered car porch. Close to the main road, schools and markets.",
    price: 42000000,
    city: "Peshawar",
    locality: "Hayatabad Phase 3",
    propertyType: PropertyType.HOUSE,
    purpose: ListingPurpose.SALE,
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 2700,
    yearBuilt: 2015,
    floors: 2,
    parkingSpaces: 2,
    furnishing: Furnishing.UNFURNISHED,
    possession: Possession.READY,
    features: ["GAS", "ELECTRICITY", "WATER_SUPPLY", "BOUNDARY_WALL", "SECURITY"],
    images: HOUSE_IMAGES,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "owner",
    title: "2 Bedroom Apartment for Rent in Qasimabad",
    description:
      "Clean 2 bedroom apartment on the second floor with a balcony, close to the main road and shops. Water and electricity connections in place. Available for families.",
    price: 35000,
    city: "Hyderabad",
    locality: "Qasimabad",
    propertyType: PropertyType.APARTMENT,
    purpose: ListingPurpose.RENT,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 950,
    yearBuilt: 2018,
    parkingSpaces: 1,
    furnishing: Furnishing.UNFURNISHED,
    possession: Possession.READY,
    features: ["ELECTRICITY", "WATER_SUPPLY", "GAS", "BALCONY"],
    images: APARTMENT_IMAGES_2,
    status: PropertyStatus.ACTIVE,
  },
  {
    seller: "agent",
    title: "Residential Plot in Satellite Town, Quetta",
    description:
      "Flat residential plot in an established area with utilities nearby, easy access to the main road. A good opportunity for building a home or for a longer-term investment.",
    price: 9500000,
    city: "Quetta",
    locality: "Satellite Town",
    propertyType: PropertyType.PLOT,
    purpose: ListingPurpose.SALE,
    isInvestment: true,
    bedrooms: 0,
    bathrooms: 0,
    areaSqFt: 2700,
    possession: Possession.READY,
    features: ["ELECTRICITY", "WATER_SUPPLY"],
    images: PLOT_IMAGES,
    status: PropertyStatus.ACTIVE,
  },
];

async function main() {
  console.log("Adding Pakistani sample listings (no existing data is changed or deleted)...");

  const passwordHash = await bcrypt.hash("password123", 12);

  const sellers: Record<Seller, { name: string; email: string; phone: string; accountType: AccountType; agencyName?: string }> = {
    owner: { name: "Ali Raza", email: "ali.raza@example.com", phone: "0300 0000001", accountType: AccountType.OWNER },
    agent: {
      name: "Sara Khan",
      email: "sara.khan@example.com",
      phone: "0300 0000002",
      accountType: AccountType.AGENT,
      agencyName: "Sample Realty",
    },
    agency: {
      name: "City Estates Desk",
      email: "city.estates@example.com",
      phone: "0300 0000003",
      accountType: AccountType.AGENCY,
      agencyName: "City Estates (sample)",
    },
  };

  const userIds: Partial<Record<Seller, string>> = {};
  for (const key of Object.keys(sellers) as Seller[]) {
    const s = sellers[key];
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        name: s.name,
        email: s.email,
        passwordHash,
        phone: s.phone,
        accountType: s.accountType,
        agencyName: s.agencyName ?? null,
      },
    });
    userIds[key] = user.id;
    console.log(`Account ready: ${s.name} (${s.email})`);
  }

  let created = 0;
  for (const listing of listings) {
    const { seller, ...data } = listing;
    const existing = await prisma.property.findFirst({ where: { title: data.title } });
    if (existing) {
      console.log(`Skipped (exists): ${data.title}`);
      continue;
    }
    await prisma.property.create({
      data: { ...data, userId: userIds[seller] as string },
    });
    created++;
    console.log(`Created: ${data.title}`);
  }

  const total = await prisma.property.count();
  console.log(`\nDone. Created ${created} new listings. Total listings now: ${total}`);
  console.log("Sample accounts (all use password: password123):");
  console.log("  ali.raza@example.com, sara.khan@example.com, city.estates@example.com");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });