import { Router } from "express";
import { validate } from "../../utils/validate";
import { authenticate } from "../../middleware/auth";
import {
  createPropertySchema,
  updatePropertySchema,
  propertyQuerySchema,
} from "./property.validation";
import * as propertyController from "./property.controller";

const router = Router();

/**
 * @swagger
 * /api/properties:
 *   get:
 *     tags: [Properties]
 *     summary: Search and filter properties
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: locality
 *         schema:
 *           type: string
 *         description: Filter by locality
 *       - in: query
 *         name: propertyType
 *         schema:
 *           type: string
 *           enum: [APARTMENT, HOUSE, VILLA, PLOT, COMMERCIAL]
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, newest, oldest]
 *           default: newest
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Cursor for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 12
 *     responses:
 *       200:
 *         description: Paginated properties
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get("/", validate(propertyQuerySchema, "query"), propertyController.searchProperties);

/**
 * @swagger
 * /api/properties/my:
 *   get:
 *     tags: [Properties]
 *     summary: Get current user's properties
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's properties
 *       401:
 *         description: Unauthorized
 */
router.get("/my", authenticate, propertyController.getMyProperties);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     tags: [Properties]
 *     summary: Get property details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Property details
 *       404:
 *         description: Property not found
 */
router.get("/:id", propertyController.getProperty);

/**
 * @swagger
 * /api/properties/{id}/similar:
 *   get:
 *     tags: [Properties]
 *     summary: Get similar properties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Similar properties
 */
router.get("/:id/similar", propertyController.getSimilarProperties);

/**
 * @swagger
 * /api/properties:
 *   post:
 *     tags: [Properties]
 *     summary: Create a new property listing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, price, city, locality, propertyType, bedrooms, bathrooms, areaSqFt, images]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               city:
 *                 type: string
 *               locality:
 *                 type: string
 *               propertyType:
 *                 type: string
 *                 enum: [APARTMENT, HOUSE, VILLA, PLOT, COMMERCIAL]
 *               bedrooms:
 *                 type: integer
 *               bathrooms:
 *                 type: integer
 *               areaSqFt:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Property created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, validate(createPropertySchema), propertyController.createProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     tags: [Properties]
 *     summary: Update a property listing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       200:
 *         description: Property updated
 *       403:
 *         description: Not owner
 *       404:
 *         description: Property not found
 */
router.put("/:id", authenticate, validate(updatePropertySchema), propertyController.updateProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     tags: [Properties]
 *     summary: Delete a property listing
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
 *         description: Property deleted
 *       403:
 *         description: Not owner
 *       404:
 *         description: Property not found
 */
router.delete("/:id", authenticate, propertyController.deleteProperty);

export default router;
