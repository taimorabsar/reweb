import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../../utils/validate";
import { authenticate } from "../../middleware/auth";
import { createInquirySchema } from "./inquiry.validation";
import * as inquiryController from "./inquiry.controller";

const router = Router();

const inquiryRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many inquiries. Please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.userId || req.ip || "unknown",
});

/**
 * @swagger
 * /api/inquiries:
 *   post:
 *     tags: [Inquiries]
 *     summary: Send an inquiry about a property
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [propertyId, message]
 *             properties:
 *               propertyId:
 *                 type: string
 *                 format: uuid
 *               message:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *     responses:
 *       201:
 *         description: Inquiry sent
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Duplicate inquiry
 *       429:
 *         description: Rate limit exceeded
 */
router.post(
  "/",
  authenticate,
  inquiryRateLimiter,
  validate(createInquirySchema),
  inquiryController.createInquiry
);

/**
 * @swagger
 * /api/inquiries/my:
 *   get:
 *     tags: [Inquiries]
 *     summary: Get current user's sent inquiries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's inquiries
 */
router.get("/my", authenticate, inquiryController.getMyInquiries);

/**
 * @swagger
 * /api/inquiries/owner:
 *   get:
 *     tags: [Inquiries]
 *     summary: Get all inquiries for properties owned by current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owner inquiries
 */
router.get("/owner", authenticate, inquiryController.getInquiriesForOwner);

/**
 * @swagger
 * /api/inquiries/property/{propertyId}:
 *   get:
 *     tags: [Inquiries]
 *     summary: Get inquiries for a property (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Property inquiries
 *       403:
 *         description: Not property owner
 */
router.get("/property/:propertyId", authenticate, inquiryController.getInquiriesForProperty);

/**
 * @swagger
 * /api/inquiries/{id}:
 *   delete:
 *     tags: [Inquiries]
 *     summary: Delete an inquiry (sender only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Inquiry deleted
 *       403:
 *         description: Not inquiry sender
 */
router.delete("/:id", authenticate, inquiryController.deleteInquiry);

export default router;
