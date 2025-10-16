import { Prisma, PrismaClient } from "@prisma/client";
import { systemPrompt } from "./singleton";

const prismaClient = new PrismaClient();

export const reset = async (channelId: string) => {
  console.log("reset called");

  return await prismaClient.$transaction(async (tx) => {
    await tx.slackAI.updateMany({
      where: { channelId },
      data: { isActive: false },
    });

    const newSession = await tx.slackAI.create({
      data: {
        channelId,
        isActive: true,
        conversations: systemPrompt as unknown as Prisma.InputJsonValue,
      },
    });

    return newSession;
  });
};
