import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import prisma from "../../config/database";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../utils/validate";
import { sendSuccess, sendCreated } from "../../utils/response";
import { BadRequestError, NotFoundError } from "../../utils/errors";

const router = Router();

const MAX_SAVED_SEARCHES = 20;

const propertyIdParams = z.object({ propertyId: z.string().uuid() });
const searchIdParams = z.object({ id: z.string().uuid() });

const createSavedSearchSchema = z.object({
  name: z.string().trim().min(1).max(80),
  params: z.object({
    city: z.string().max(100).optional(),
    propertyType: z.enum(["APARTMENT", "HOUSE", "VILLA", "PLOT", "COMMERCIAL"]).optional(),
    purpose: z.enum(["SALE", "RENT"]).optional(),
    investment: z.literal("true").optional(),
    minPrice: z.number().nonnegative().optional(),
    maxPrice: z.number().nonnegative().optional(),
    bedrooms: z.number().int().min(0).max(20).optional(),
    sort: z.enum(["newest", "oldest", "price_asc", "price_desc"]).optional(),
  }),
});

const FAVORITE_PROPERTY_INCLUDE = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      accountType: true,
      agencyName: true,
      avatarUrl: true,
    },
  },
};

// ---- Favorites ----

router.get("/favorites", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.favorite.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      include: { property: { include: FAVORITE_PROPERTY_INCLUDE } },
    });
    sendSuccess(res, rows.map((r) => r.property), "Saved properties fetched");
  } catch (error) {
    next(error);
  }
});

router.get("/favorites/ids", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.favorite.findMany({
      where: { userId: req.user!.userId },
      select: { propertyId: true },
    });
    sendSuccess(res, rows.map((r) => r.propertyId), "Saved property ids fetched");
  } catch (error) {
    next(error);
  }
});

router.post(
  "/favorites/:propertyId",
  authenticate,
  validate(propertyIdParams, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { propertyId } = req.params;

      const property = await prisma.property.findUnique({ where: { id: propertyId }, select: { id: true } });
      if (!property) throw new NotFoundError("Property not found");

      await prisma.favorite.upsert({
        where: { userId_propertyId: { userId, propertyId } },
        update: {},
        create: { userId, propertyId },
      });
      sendCreated(res, { propertyId }, "Property saved");
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/favorites/:propertyId",
  authenticate,
  validate(propertyIdParams, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.favorite.deleteMany({
        where: { userId: req.user!.userId, propertyId: req.params.propertyId },
      });
      sendSuccess(res, { propertyId: req.params.propertyId }, "Property removed from saved");
    } catch (error) {
      next(error);
    }
  }
);

// ---- Saved searches ----

router.get("/saved-searches", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.savedSearch.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
    });
    sendSuccess(res, rows, "Saved searches fetched");
  } catch (error) {
    next(error);
  }
});

router.post(
  "/saved-searches",
  authenticate,
  validate(createSavedSearchSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const count = await prisma.savedSearch.count({ where: { userId } });
      if (count >= MAX_SAVED_SEARCHES) {
        throw new BadRequestError(`You can save up to ${MAX_SAVED_SEARCHES} searches`);
      }
      const created = await prisma.savedSearch.create({
        data: {
          userId,
          name: req.body.name,
          params: req.body.params as Prisma.InputJsonObject,
        },
      });
      sendCreated(res, created, "Search saved");
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/saved-searches/:id",
  authenticate,
  validate(searchIdParams, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await prisma.savedSearch.deleteMany({
        where: { id: req.params.id, userId: req.user!.userId },
      });
      if (result.count === 0) throw new NotFoundError("Saved search not found");
      sendSuccess(res, { id: req.params.id }, "Saved search deleted");
    } catch (error) {
      next(error);
    }
  }
);

export default router;