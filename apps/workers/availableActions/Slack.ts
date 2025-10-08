// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
import { WebClient, LogLevel, type Block, type KnownBlock } from "@slack/web-api";
import { App } from "@slack/bolt";

const SLACK_XAPP = process.env.SLACK_XAPP;
const SLACK_XOXB = process.env.SLACK_XOXB;


console.log(SLACK_XAPP);
console.log(SLACK_XOXB);

const client = new WebClient(SLACK_XOXB, {
  logLevel: LogLevel.DEBUG,
});

async function findConversation(name: string) {
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await client.conversations.list({
      // The token you used to initialize your app
      token: SLACK_XOXB,
    });

    for (const channel of result.channels) {
      if (channel.name === name) {
        conversationId = channel.id;

        // Print result
        console.log("Found conversation ID: " + conversationId);
        // Break from for loop
        break;
      }
    }
  } catch (error) {
    console.error(error);
  }
}



async function publishMessage(metadata: any) {
  try {
    const blocks: KnownBlock[] = [
      {
        type: "header",
        text: { type: "plain_text", text: metadata.headerText },
      } as KnownBlock,
      {
        type: "section",
        fields: metadata.fields.map((f: any) => ({ type: f.type, text: f.text })),
      } as KnownBlock,
      metadata.contextText
        ? ({
            type: "context",
            elements: [{ type: "mrkdwn", text: metadata.contextText }],
          } as KnownBlock)
        : undefined,
      metadata.buttons && metadata.buttons.length > 0
        ? ({
            type: "actions",
            elements: metadata.buttons.map((b: any) => ({
              type: "button",
              text: { type: "plain_text", text: b.text },
              value: b.value,
              style: b.style,
            })),
          } as KnownBlock)
        : undefined,
    ].filter((b): b is KnownBlock => !!b); 
  
const id = metadata.channelId;
    await client.conversations.join({ channel: id });

    const result = await client.chat.postMessage({
      token: SLACK_XOXB,
      channel: id,
      blocks,
      text: metadata.headerText || "Message",
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

export { publishMessage, findConversation };

const app = new App({
  token: SLACK_XOXB,
  appToken: SLACK_XAPP,
  socketMode: true,
});
// Listen for mentions
app.event("app_mention", async ({ event, say }) => {
  console.log("👋 Bot mentioned by:", event.user);
  console.log("📩 Message text:", event.text);
  console.log("🧭 Channel:", event.channel);

  // Optionally respond in Slack
  await say(`Hey <@${event.user}>! I saw your message.`);
});

// Start the bot
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Worksync bot is running!");
})();
