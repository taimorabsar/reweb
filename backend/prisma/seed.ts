import { PrismaClient, PropertyType, PropertyStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "balakrishna@test.com" },
    update: {},
    create: {
      name: "Balakrishnamoorthy S",
      email: "balakrishna@test.com",
      passwordHash,
      phone: "+91 98765 43210",
    },
  });

  console.log(`User created: ${user.name} (${user.email})`);

  const properties = [
    {
      title: "Spacious 3BHK Apartment in Indiranagar",
      description:
        "Beautiful 3BHK apartment in the heart of Indiranagar. This spacious 1800 sq.ft. apartment features modern interiors, modular kitchen with chimney, split ACs in all bedrooms, and a large balcony overlooking the garden. Walking distance to metro station, Orion Mall, and major IT parks. Gated community with 24/7 security, swimming pool, and gym. Ideal for families looking for a premium lifestyle in East Bangalore.",
      price: 18500000,
      city: "Bangalore",
      locality: "Indiranagar",
      propertyType: PropertyType.APARTMENT,
      bedrooms: 3,
      bathrooms: 3,
      areaSqFt: 1800,
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800",
      ],
      status: PropertyStatus.ACTIVE,
    },
    {
      title: "Luxury Villa with Private Pool in Whitefield",
      description:
        "Stunning 4BHK independent villa spread across 3200 sq.ft. with a private swimming pool and landscaped garden. Italian marble flooring, designer kitchen, home theater room, and servant quarters. Located in a premium gated community with clubhouse, tennis court, and jogging track. Close to ITPL and major schools. This is a corner plot with excellent ventilation and natural light throughout the day.",
      price: 45000000,
      city: "Bangalore",
      locality: "Whitefield",
      propertyType: PropertyType.VILLA,
      bedrooms: 4,
      bathrooms: 5,
      areaSqFt: 3200,
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      ],
      status: PropertyStatus.ACTIVE,
    },
    {
      title: "Modern 2BHK in Koramangala",
      description:
        "Well-maintained 2BHK apartment in the popular 5th Block, Koramangala. Fully furnished with queen beds, smart TV, washing machine, and refrigerator. Excellent connectivity to HSR Layout and BTM. Surrounded by cafes, restaurants, and shopping centers. Perfect for young professionals. The apartment gets great natural light and has been recently painted. Available for immediate occupation.",
      price: 8500000,
      city: "Bangalore",
      locality: "Koramangala",
      propertyType: PropertyType.APARTMENT,
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1100,
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      ],
      status: PropertyStatus.ACTIVE,
    },
    {
      title: "Premium Office Space in MG Road",
      description:
        "Grade A commercial office space of 2500 sq.ft. on MG Road. Located in a landmark building with high footfall. Equipped with central AC, modular flooring, dedicated power backup, and high-speed internet. Floor-to-ceiling windows with stunning city views. Ideal for corporate offices, consulting firms, or co-working spaces. 3 dedicated car parking slots included. Near Metro station.",
      price: 35000000,
      city: "Bangalore",
      locality: "MG Road",
      propertyType: PropertyType.COMMERCIAL,
      bedrooms: 0,
      bathrooms: 4,
      areaSqFt: 2500,
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      ],
      status: PropertyStatus.ACTIVE,
    },
    {
      title: "Plot in Sarjapur Road - Great Investment",
      description:
        "East-facing 1200 sq.ft. residential plot in a developed layout on Sarjapur Road. BDA approved with clear title. All infrastructure in place — roads, drainage, electricity, and water supply. Walking distance to Wipro campus and upcoming metro station. Rapidly appreciating area with multiple IT companies setting up offices nearby. Excellent for building your dream home or as a long-term investment. EOI buyers preferred.",
      price: 7200000,
      city: "Bangalore",
      locality: "Sarjapur Road",
      propertyType: PropertyType.PLOT,
      bedrooms: 0,
      bathrooms: 0,
      areaSqFt: 1200,
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800",
      ],
      status: PropertyStatus.ACTIVE,
    },
    {
      title: "Cozy 1BHK near HSR Layout",
      description:
        "Compact and well-designed 1BHK apartment perfect for bachelors or a couple. 650 sq.ft. with an open kitchen, built-in wardrobe, and a small utility area. The building has lift, covered parking, and CCTV surveillance. Walking distance to HSR Layout BDA Complex. Auto and bus stand within 2 minutes. Monthly maintenance is very affordable at Rs 1500. Water supply from both borewell and Cauvery.",
      price: 4200000,
      city: "Bangalore",
      locality: "HSR Layout",
      propertyType: PropertyType.APARTMENT,
      bedrooms: 1,
      bathrooms: 1,
      areaSqFt: 650,
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      ],
      status: PropertyStatus.ACTIVE,
    },
    {
      title: "Independent House in JP Nagar",
      description:
        "Well-built 3BHK independent house with a large terrace in JP Nagar 7th Phase. 1850 sq.ft. built-up area on a 20x30 site. Ground floor has a spacious living room, kitchen, and one bedroom. First floor has 2 bedrooms with attached bathrooms. Additional storage room on terrace. Separate borewell and sump. Ideal for a joint family. Close to Puttenahalli Lake and multiple schools.",
      price: 14500000,
      city: "Bangalore",
      locality: "JP Nagar",
      propertyType: PropertyType.HOUSE,
      bedrooms: 3,
      bathrooms: 3,
      areaSqFt: 1850,
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      ],
      status: PropertyStatus.ACTIVE,
    },
    {
      title: "Sea-Facing 2BHK in Mumbai Andheri",
      description:
        "Beautiful sea-facing 2BHK in Andheri West with stunning Arabian Sea views from the living room and master bedroom. 950 sq.ft. with Italian marble flooring and modern fittings. Walking distance to Juhu Beach and Versova Metro. Building has swimming pool, gym, and 24/7 power backup. Society is well-maintained with active management committee. Perfect for someone who loves the ocean breeze.",
      price: 22000000,
      city: "Mumbai",
      locality: "Andheri West",
      propertyType: PropertyType.APARTMENT,
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 950,
      images: [
        "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      ],
      status: PropertyStatus.ACTIVE,
    },
    {
      title: "4BHK Penthouse in Powai",
      description:
        "Exclusive 4BHK penthouse spanning 3800 sq.ft. with a private rooftop terrace and jacuzzi. Panoramic views of Powai Lake and Hiranandani skyline. Imported marble, modular kitchen by German brand, smart home automation, and private elevator. Dedicated servant room with separate entrance. Triple car parking in stilt level. One of only 4 penthouses in this premium 20-story tower. A rare find in Powai.",
      price: 75000000,
      city: "Mumbai",
      locality: "Powai",
      propertyType: PropertyType.VILLA,
      bedrooms: 4,
      bathrooms: 5,
      areaSqFt: 3800,
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      ],
      status: PropertyStatus.ACTIVE,
    },
    {
      title: "Residential Plot in Chennai OMR",
      description:
        "Prime 1500 sq.ft. plot on OMR (Old Mahabalipuram Road) near Sholinganallur. CMDA approved with clear documents. Located in a gated community with compound wall, security, and ready-to-build infrastructure. Close to SIPCOT IT Park, TCS, and major schools. 10 minutes to the beach. Metro connectivity coming soon. Excellent for building a duplex house. Bank loan available from all major banks.",
      price: 9500000,
      city: "Chennai",
      locality: "OMR Sholinganallur",
      propertyType: PropertyType.PLOT,
      bedrooms: 0,
      bathrooms: 0,
      areaSqFt: 1500,
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      ],
      status: PropertyStatus.ACTIVE,
    },
    {
      title: "Furnished 3BHK in Hyderabad Gachibowli",
      description:
        "Fully furnished 3BHK in a premium gated community in Gachibowli. 1650 sq.ft. with modern interiors, modular kitchen, premium wardrobes, and all appliances included. Community features include swimming pool, cricket pitch, jogging track, and children's play area. 5 minutes to Financial District and major IT companies. ORR connectivity makes it easy to reach any part of Hyderabad. Company lease tenants preferred.",
      price: 12000000,
      city: "Hyderabad",
      locality: "Gachibowli",
      propertyType: PropertyType.APARTMENT,
      bedrooms: 3,
      bathrooms: 3,
      areaSqFt: 1650,
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800",
      ],
      status: PropertyStatus.ACTIVE,
    },
    {
      title: "Standalone Office Building in Pune Kothrud",
      description:
        "G+2 commercial building of 4500 sq.ft. in Kothrud, one of Pune's most sought-after commercial areas. Ground floor suitable for retail showroom, first and second floors for offices. Each floor has 2 cabins, open work area, pantry, and washrooms. Dedicated parking for 6 cars. Strong footfall area with banks, restaurants, and shops nearby. Currently tenanted with rental income of Rs 1.8L per month. Great investment opportunity.",
      price: 52000000,
      city: "Pune",
      locality: "Kothrud",
      propertyType: PropertyType.COMMERCIAL,
      bedrooms: 0,
      bathrooms: 6,
      areaSqFt: 4500,
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      ],
      status: PropertyStatus.ACTIVE,
    },
  ];

  let created = 0;
  for (const prop of properties) {
    const existing = await prisma.property.findFirst({
      where: { title: prop.title },
    });
    if (!existing) {
      await prisma.property.create({
        data: {
          userId: user.id,
          ...prop,
        },
      });
      created++;
      console.log(`Created: ${prop.title}`);
    } else {
      console.log(`Skipped (exists): ${prop.title}`);
    }
  }

  const total = await prisma.property.count();
  console.log(`\nSeeding complete! Created ${created} new properties. Total: ${total}`);
  console.log(`\nTest user credentials:`);
  console.log(`  Email: balakrishna@test.com`);
  console.log(`  Password: password123`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
