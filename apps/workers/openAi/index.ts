import { openAIURL } from "@repo/config";
import OpenAI from "openai";
import { Prisma, PrismaClient } from "@prisma/client";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

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

  const existing = await prismaClient.slackAI.findUnique({
    where: { channelId: ChannelId },
  });
  console.log("Exisiting convos: ", existing?.conversations);

  const systemPrompt: ChatCompletionMessageParam = {
    role: "system",
    content: `
You are assisting a user in Slack. When replying, always prepend or reference the user by writing <@USERID>.
Do not replace the <> yourself — just keep it as <@USERID>. The code sending the message will dynamically replace USERID with the actual Slack user ID.

Respond like a technically sharp, concise software engineer:
- brief, precise, technically grounded
- direct language, structured explanations, minimal fluff
- focus on implementation details, trade-offs, quick fixes
- tone: confident, practical, iterative
- code: clean, minimal, production-ready
- avoid verbose explanations unless necessary
`,
  };

  let conversationHistory: ChatCompletionMessageParam[] = [systemPrompt];

  if (existing?.conversations) {
    const past =
      existing.conversations as unknown as ChatCompletionMessageParam[];
    conversationHistory.push(...past);
  }

  conversationHistory.push({ role: "user", content: userContext });

  const systemMsg = conversationHistory[0] as ChatCompletionMessageParam;
  const userMsgs = conversationHistory.slice(1);
  const trimmed = userMsgs.slice(-10);
  conversationHistory = [systemMsg, ...trimmed];

  const response = await client.chat.completions.create({
    model: "ai/smollm2",
    messages: conversationHistory,
  });

  let reply = response.choices[0]?.message?.content || "";
  reply = reply.replace("<@USERID>", `<@${user}>`);
  reply = `<@${user}>  ${reply}`;
  conversationHistory.push({ role: "assistant", content: reply });

  console.log("updateing DB");

  const db = await prismaClient.slackAI.upsert({
    where: { channelId: ChannelId },
    update: {
      conversations: conversationHistory as unknown as Prisma.InputJsonValue,
    },
    create: {
      channelId: ChannelId,
      conversations: conversationHistory as unknown as Prisma.InputJsonValue,
    },
  });

  console.log("DB result:", db);
  console.log("AI:", reply);
  return reply;
}

// const completion = await client.chat.completions.create({
//   model: "ai/smollm2",
//   messages: [
//     {
//       role: "system",
//       content: systemContext,
//     },
//     {
//       role: "user",
//       content: userContext,
//     },
//   ],
//   max_tokens: 4000,
//   temperature: 0.7,
// });

// console.log(completion.choices[0].message.content);
