import OpenAI from "openai";


const client = new OpenAI({
  apiKey: "dummy-key", // Required, but can be any string if local server ignores it
  baseURL: "http://localhost:12434/engines/llama.cpp/v1/",
});

const completion = await client.chat.completions.create({
  model: "ai/smollm2",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    {
      role: "user",
      content: "generate js code to openai endpoints",
    },
  ],
});

console.log(completion.choices[0].message.content);
