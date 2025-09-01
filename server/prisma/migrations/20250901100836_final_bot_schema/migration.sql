-- CreateEnum
CREATE TYPE "public"."BotStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TRAINING');

-- AlterTable
ALTER TABLE "public"."Bot" ADD COLUMN     "headerText" TEXT DEFAULT 'Chat with AI',
ADD COLUMN     "initialMessage" TEXT DEFAULT 'Hi! How can I help you today?',
ADD COLUMN     "lastActivityAt" TIMESTAMP(3),
ADD COLUMN     "primaryColor" TEXT DEFAULT '#007bff',
ADD COLUMN     "status" "public"."BotStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "totalQueries" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trainedSources" TEXT[];
