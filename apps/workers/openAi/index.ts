import { openAIURL } from "@repo/config";
import OpenAI from "openai";

const openAIKey = process.env.openAIKey;


const client = new OpenAI({
  apiKey: openAIKey, // Required, but can be any string if local server ignores it
  baseURL: openAIURL,
});

const completion = await client.chat.completions.create({
  model: "ai/smollm2",
  messages: [
    {
      role: "system",
      content:
        "You are a deeply analytical assistant with a 4000-token context window.",
    },
    {
      role: "user",
      content: `
Use your full reasoning bandwidth.
Explain in depth how modern AI models process language, from tokenization to attention mechanisms, and how scaling laws affect their performance.
Provide technical detail, examples, and comparisons where possible.
`,
    },
  ],
  max_tokens: 4000,
  temperature: 0.7,
});

console.log(completion.choices[0].message.content);
