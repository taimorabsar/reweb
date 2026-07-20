import prisma from "../../config/database";
import { ConflictError, NotFoundError, ForbiddenError } from "../../utils/errors";
import { CreateInquiryInput } from "./inquiry.validation";

const INQUIRY_INCLUDE = {
  property: {
    select: {
      id: true,
      title: true,
      city: true,
      locality: true,
      price: true,
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  },
  sender: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  replies: {
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
};

export async function createInquiry(senderId: string, data: CreateInquiryInput) {
  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  if (property.userId === senderId) {
    throw new ForbiddenError("You cannot inquire about your own property");
  }

  const existingInquiry = await prisma.inquiry.findUnique({
    where: {
      propertyId_senderId: {
        propertyId: data.propertyId,
        senderId,
      },
    },
  });

  if (existingInquiry) {
    throw new ConflictError("You have already inquired about this property");
  }

  return prisma.inquiry.create({
    data: {
      propertyId: data.propertyId,
      senderId,
      message: data.message,
    },
    include: INQUIRY_INCLUDE,
  });
}

export async function getInquiriesForProperty(propertyId: string, userId: string) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  if (property.userId !== userId) {
    throw new ForbiddenError("You can only view inquiries for your own properties");
  }

  return prisma.inquiry.findMany({
    where: { propertyId },
    include: INQUIRY_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyInquiries(userId: string) {
  return prisma.inquiry.findMany({
    where: { senderId: userId },
    include: INQUIRY_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteInquiry(id: string, userId: string) {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
  });

  if (!inquiry) {
    throw new NotFoundError("Inquiry not found");
  }

  if (inquiry.senderId !== userId) {
    throw new ForbiddenError("You can only delete your own inquiries");
  }

  await prisma.inquiry.delete({ where: { id } });
}

export async function getInquiriesForOwner(userId: string) {
  return prisma.inquiry.findMany({
    where: {
      property: { userId },
    },
    include: INQUIRY_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}
