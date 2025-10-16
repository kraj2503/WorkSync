import { openAIURL } from "@repo/config";
import OpenAI from "openai";
import { Prisma, PrismaClient } from "@prisma/client";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { systemPrompt } from "./singleton";

const openAIKey = process.env.openAIKey;
console.log(openAIKey);

const client = new OpenAI({
  apiKey: openAIKey,
  baseURL: openAIURL,
});
const prismaClient = new PrismaClient();

export async function CHATAI({
  user,
  ChannelId,
  userContext,
}: {
  user: string;
  ChannelId: string;
  userContext: string;
}) {
  console.log("got To respond to user");

  const existing = await prismaClient.slackAI.findFirst({
    where: {
      channelId: ChannelId,
      isActive: true,
    },
  });

  let conversationHistory: ChatCompletionMessageParam[] = [];
  if (existing?.conversations && Array.isArray(existing.conversations)) {
    const past =
      existing.conversations as unknown as ChatCompletionMessageParam[];
    conversationHistory.push(...past);
  }

  // 3. Ensure the System Prompt is always the first message if history is empty
  // This is critical for model behavior. Assuming 'systemPrompt' is defined elsewhere.
  if (conversationHistory.length === 0) {
    conversationHistory.push(systemPrompt); // Make sure systemPrompt is available and an object
  }

  conversationHistory.push({ role: "user", content: userContext });
  // console.log(conversationHistory);

  // generate AI response
  const response = await client.chat.completions.create({
    model: "ai/magistral-small-3.2:latest",
    // model: "ai/smollm2",
    messages: conversationHistory,
    temperature: 0.2,
    max_tokens: 500,
  });

  let reply = response.choices[0]?.message?.content || "";
  console.log("reply",reply);
  // reply = reply.replace(/<@USERID>/g, `<@${user}>`);
  // if (!reply.trim().startsWith(`<@${user}>`)) {
  //   reply = `<@${user}>  ${reply}`;
  // }
  conversationHistory.push({ role: "assistant", content: reply });

  // store in DB
  let db;
  if (existing) {
    db = await prismaClient.slackAI.update({
      where: { id: existing.id },
      data: { conversations: conversationHistory },
    });
  } else {
    db = await prismaClient.slackAI.create({
      data: {
        channelId: ChannelId,
        conversations: conversationHistory,
        isActive: true,
      },
    });
  }
 reply = reply.replace(/<([A-Z0-9]+)>/g, "<@$1>");
  return reply;
}
