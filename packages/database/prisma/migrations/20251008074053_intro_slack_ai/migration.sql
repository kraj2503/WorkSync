-- CreateTable
CREATE TABLE "slackAI" (
    "channelId" TEXT NOT NULL,
    "convesations" JSONB NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "slackAI_channelId_key" ON "slackAI"("channelId");
