// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
import { WebClient, LogLevel, type KnownBlock } from "@slack/web-api";
import { App } from "@slack/bolt";
import { CHATAI } from "../openAi";
import { reset } from "../openAi/reset";

const SLACK_XAPP = process.env.SLACK_XAPP;
const SLACK_XOXB = process.env.SLACK_XOXB;

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
        fields: metadata.fields.map((f: any) => ({
          type: f.type,
          text: f.text,
        })),
      } as KnownBlock,
      metadata.contextText
        ? ({
            type: "context",
            elements: [{ type: "mrkdwn", text: metadata.contextText }],
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
app.event("app_mention", async ({ event, say }) => {
  console.log("👋 Bot mentioned by:", event.user);
  console.log("📩 Message text:", event.text);
  console.log("🧭 Channel:", event.channel);

  console.log(event.text);
  if (event.text.includes("/reset")) {
    console.log("reset called");
    
    await reset(event.channel);
    say("reset done!")
  }
  else {
    
    console.log(`ibnsied`);
    
    const reply = await CHATAI({
      user: event.user ?? "",
      
      ChannelId: event.channel,
      userContext: event.text,
    });
    
    await say(reply);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Worksync bot is running!");
})();
