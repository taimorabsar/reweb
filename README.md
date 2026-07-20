# RealEstate — Full-Stack Property Listing Platform

A full-stack real-estate listing platform built with **TypeScript**, **Express.js**, **Next.js**, **PostgreSQL**, **Prisma ORM**, and **Tailwind CSS**. Users can list properties, search/filter, send inquiries, and reply in a two-way messaging system.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| Backend | Express.js, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens) |
| Image Storage | AWS S3 (via multer for server-side upload) |
| Validation | Zod |
| API Docs | Swagger (swagger-jsdoc + swagger-ui-express) |

---

## Features

- **JWT Authentication** — Register/login with access + refresh token rotation
- **Property CRUD** — Create, edit, delete properties with image upload (up to 5 images)
- **Search & Filter** — City, property type, price range, bedrooms with cursor-based pagination
- **Similar Properties** — Related listings shown on property detail page
- **Inquiry System** — Users can send inquiries about properties
- **Two-way Messaging** — Property owners and inquiry senders can reply to each other
- **Rate Limiting** — Global and per-route rate limiting
- **Responsive UI** — Mobile-first design with Tailwind CSS
- **SEO** — JSON-LD structured data, OpenGraph meta tags, ISR on detail pages
- **API Documentation** — Swagger UI at `/api-docs`

---

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── seed.ts              # Seed data (12 properties)
│   │   └── migrations/
│   ├── src/
│   │   ├── app.ts               # Express app entry point
│   │   ├── config/              # env, database, S3, Swagger config
│   │   ├── middleware/           # auth, errorHandler
│   │   └── modules/
│   │       ├── auth/            # login, register, refresh, logout
│   │       ├── property/        # CRUD, search, similar
│   │       ├── inquiry/         # send, list, delete inquiries
│   │       ├── reply/           # reply to inquiries
│   │       └── upload/          # S3 image upload
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── properties/      # List + detail pages
│   │   │   └── dashboard/       # My Properties, Sent, Received tabs
│   │   ├── components/          # Navbar, Footer, PropertyCard, InquiryForm
│   │   ├── lib/                 # api.ts (API client), auth-context.tsx, utils.ts
│   │   └── types/               # TypeScript interfaces
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14 running on `localhost:5432`
- **AWS S3 bucket** (for image uploads) — or skip S3 setup and use local storage
- **npm** or **yarn**

---

## Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Balakrishnamoorthy/real-estate-platform.git
cd real-estate-platform
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE realestate;
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/realestate?schema=public"

# JWT
JWT_SECRET="your-random-secret-at-least-16-chars"
JWT_REFRESH_SECRET="your-random-refresh-secret-16"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# AWS S3 (create an IAM user with S3 access)
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET_NAME="your-bucket-name"

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

Run migrations and seed the database:

```bash
npx prisma migrate dev
npx prisma db seed
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000` and Swagger docs at `http://localhost:5000/api-docs`.

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

### 5. Test Account

A seed user is created automatically:

| Field | Value |
|-------|-------|
| Name | Balakrishnamoorthy S |
| Email | `balakrishna@test.com` |
| Password | `password123` |

You can also register a new account from the UI.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/profile` | Get current user profile |
| GET | `/api/properties` | Search properties (query params) |
| GET | `/api/properties/:id` | Get property by ID |
| POST | `/api/properties` | Create property (auth) |
| PUT | `/api/properties/:id` | Update property (owner) |
| DELETE | `/api/properties/:id` | Delete property (owner) |
| GET | `/api/properties/:id/similar` | Similar properties |
| GET | `/api/properties/my` | My properties (auth) |
| POST | `/api/inquiries` | Send inquiry (auth) |
| GET | `/api/inquiries/my` | My sent inquiries (auth) |
| GET | `/api/inquiries/owner` | Inquiries on my properties (auth) |
| GET | `/api/inquiries/property/:id` | Inquiries for a property (owner) |
| POST | `/api/replies` | Reply to inquiry (auth) |
| GET | `/api/replies/:inquiryId` | Get replies for inquiry (auth) |
| POST | `/api/upload` | Upload images to S3 (auth) |

---

## AWS S3 Setup (Optional)

1. Create an S3 bucket (e.g., `realestatetask`) in `ap-south-1`
2. Create an IAM user with this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

3. Add the access key and secret to your `backend/.env`

---

## Scripts

### Backend

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run start        # Start production server
npx prisma migrate dev   # Run migrations
npx prisma db seed      # Seed database
npx prisma studio       # Open Prisma Studio (GUI)
```

### Frontend

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
```

---

## License

MIT
