/*
  Warnings:

  - The required column `id` was added to the `slackAI` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "slackAI_channelId_key";

-- AlterTable
ALTER TABLE "slackAI" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "slackAI_pkey" PRIMARY KEY ("id");
