import prisma from "../../config/database";
import { NotFoundError, ForbiddenError } from "../../utils/errors";
import { CreatePropertyInput, UpdatePropertyInput, PropertyQueryInput } from "./property.validation";

const PROPERTY_INCLUDE = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true, accountType: true, agencyName: true, avatarUrl: true,
    },
  },
};

export async function createProperty(userId: string, data: CreatePropertyInput) {
  return prisma.property.create({
    data: {
      userId,
      ...data,
    },
    include: PROPERTY_INCLUDE,
  });
}

export async function getProperty(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: PROPERTY_INCLUDE,
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  return property;
}

export async function updateProperty(id: string, userId: string, data: UpdatePropertyInput) {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  if (property.userId !== userId) {
    throw new ForbiddenError("You can only edit your own properties");
  }

  return prisma.property.update({
    where: { id },
    data,
    include: PROPERTY_INCLUDE,
  });
}

export async function deleteProperty(id: string, userId: string) {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  if (property.userId !== userId) {
    throw new ForbiddenError("You can only delete your own properties");
  }

  await prisma.property.delete({ where: { id } });
}

export async function searchProperties(query: PropertyQueryInput) {
  const { city, locality, propertyType, minPrice, maxPrice, bedrooms, status, sort, cursor, limit, purpose, investment, sellerType } = query;

  const where: Record<string, unknown> = {};

  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }
  if (locality) {
    where.locality = { contains: locality, mode: "insensitive" };
  }
  if (propertyType) {
    where.propertyType = propertyType;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) (where.price as Record<string, number>).gte = minPrice;
    if (maxPrice !== undefined) (where.price as Record<string, number>).lte = maxPrice;
  }
  if (purpose) { where.purpose = purpose; } if (investment === "true") { where.isInvestment = true; } if (sellerType) { where.user = { accountType: sellerType }; } if (bedrooms !== undefined) {
    where.bedrooms = bedrooms;
  }
  if (status) {
    where.status = status;
  } else {
    where.status = "ACTIVE";
  }

  const orderBy = (() => {
    switch (sort) {
      case "price_asc": return { price: "asc" as const };
      case "price_desc": return { price: "desc" as const };
      case "oldest": return { createdAt: "asc" as const };
      case "newest":
      default: return { createdAt: "desc" as const };
    }
  })();

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: PROPERTY_INCLUDE,
      orderBy,
      take: limit + 1,
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
    }),
    prisma.property.count({ where }),
  ]);

  const hasMore = properties.length > limit;
  const data = hasMore ? properties.slice(0, limit) : properties;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return { data, total, nextCursor };
}

export async function getSimilarProperties(propertyId: string) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  const budgetMin = property.price * 0.7;
  const budgetMax = property.price * 1.3;

  const similar = await prisma.property.findMany({
    where: {
      id: { not: propertyId },
      city: property.city,
      propertyType: property.propertyType,
      price: { gte: budgetMin, lte: budgetMax },
      status: "ACTIVE",
    },
    include: PROPERTY_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return similar;
}

export async function getMyProperties(userId: string) {
  return prisma.property.findMany({
    where: { userId },
    include: PROPERTY_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}
