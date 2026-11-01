-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('OWNER', 'AGENT', 'AGENCY');

-- CreateEnum
CREATE TYPE "ListingPurpose" AS ENUM ('SALE', 'RENT');

-- CreateEnum
CREATE TYPE "Furnishing" AS ENUM ('FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED');

-- CreateEnum
CREATE TYPE "Possession" AS ENUM ('READY', 'UNDER_CONSTRUCTION');

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "floors" INTEGER,
ADD COLUMN     "furnishing" "Furnishing",
ADD COLUMN     "is_investment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parking_spaces" INTEGER,
ADD COLUMN     "possession" "Possession",
ADD COLUMN     "purpose" "ListingPurpose" NOT NULL DEFAULT 'SALE',
ADD COLUMN     "year_built" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "account_type" "AccountType" NOT NULL DEFAULT 'OWNER',
ADD COLUMN     "agency_name" TEXT,
ADD COLUMN     "avatar_url" TEXT;

-- CreateIndex
CREATE INDEX "properties_purpose_idx" ON "properties"("purpose");
