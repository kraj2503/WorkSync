/*
  Warnings:

  - You are about to drop the column `convesations` on the `slackAI` table. All the data in the column will be lost.
  - Added the required column `conversations` to the `slackAI` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "slackAI" DROP COLUMN "convesations",
ADD COLUMN     "conversations" JSONB NOT NULL;
