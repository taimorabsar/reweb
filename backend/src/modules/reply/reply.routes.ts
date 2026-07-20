import { Router } from "express";
import { validate } from "../../utils/validate";
import { authenticate } from "../../middleware/auth";
import { createReplySchema } from "./reply.validation";
import * as replyController from "./reply.controller";

const router = Router();

/**
 * @swagger
 * /api/replies:
 *   post:
 *     tags: [Replies]
 *     summary: Reply to an inquiry (property owner or inquiry sender)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [inquiryId, message]
 *             properties:
 *               inquiryId:
 *                 type: string
 *                 format: uuid
 *               message:
 *                 type: string
 *                 maxLength: 2000
 *     responses:
 *       201:
 *         description: Reply sent
 *       403:
 *         description: Not authorized to reply
 *       404:
 *         description: Inquiry not found
 */
router.post("/", authenticate, validate(createReplySchema), replyController.createReply);

/**
 * @swagger
 * /api/replies/{inquiryId}:
 *   get:
 *     tags: [Replies]
 *     summary: Get replies for an inquiry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inquiryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Replies list
 *       403:
 *         description: Not authorized
 */
router.get("/:inquiryId", authenticate, replyController.getRepliesForInquiry);

export default router;
