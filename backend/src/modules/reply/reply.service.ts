import prisma from "../../config/database";
import { NotFoundError, ForbiddenError } from "../../utils/errors";
import { CreateReplyInput } from "./reply.validation";

const REPLY_INCLUDE = {
  sender: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

export async function createReply(senderId: string, data: CreateReplyInput) {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: data.inquiryId },
    include: {
      property: { select: { userId: true } },
    },
  });

  if (!inquiry) {
    throw new NotFoundError("Inquiry not found");
  }

  const isSender = inquiry.senderId === senderId;
  const isPropertyOwner = inquiry.property.userId === senderId;

  if (!isSender && !isPropertyOwner) {
    throw new ForbiddenError("You can only reply to inquiries on your properties or inquiries you sent");
  }

  return prisma.reply.create({
    data: {
      inquiryId: data.inquiryId,
      senderId,
      message: data.message,
    },
    include: REPLY_INCLUDE,
  });
}

export async function getRepliesForInquiry(inquiryId: string, userId: string) {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
    include: {
      property: { select: { userId: true } },
    },
  });

  if (!inquiry) {
    throw new NotFoundError("Inquiry not found");
  }

  const isSender = inquiry.senderId === userId;
  const isPropertyOwner = inquiry.property.userId === userId;

  if (!isSender && !isPropertyOwner) {
    throw new ForbiddenError("You can only view replies for your inquiries");
  }

  return prisma.reply.findMany({
    where: { inquiryId },
    include: REPLY_INCLUDE,
    orderBy: { createdAt: "asc" },
  });
}
