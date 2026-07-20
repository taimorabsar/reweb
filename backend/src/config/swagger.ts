import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Real-Estate Listing Platform API",
      version: "1.0.0",
      description: "A scalable real-estate listing platform API with authentication, property management, search, and inquiry modules.",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string", nullable: true },
            role: { type: "string", enum: ["USER", "ADMIN"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Property: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            title: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            city: { type: "string" },
            locality: { type: "string" },
            propertyType: { type: "string", enum: ["APARTMENT", "HOUSE", "VILLA", "PLOT", "COMMERCIAL"] },
            bedrooms: { type: "integer" },
            bathrooms: { type: "integer" },
            areaSqFt: { type: "number" },
            images: { type: "array", items: { type: "string" } },
            status: { type: "string", enum: ["ACTIVE", "SOLD", "RENTED"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        Inquiry: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            propertyId: { type: "string", format: "uuid" },
            senderId: { type: "string", format: "uuid" },
            message: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            property: { $ref: "#/components/schemas/Property" },
            sender: { $ref: "#/components/schemas/User" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: { type: "array", items: { type: "object" } },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "array", items: {} },
            pagination: {
              type: "object",
              properties: {
                nextCursor: { type: "string", nullable: true },
                hasMore: { type: "boolean" },
                total: { type: "integer" },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/modules/**/*.ts", "./src/modules/**/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
