import { Kafka } from "kafkajs";
import { TOPIC_NAME } from "@repo/config";
const kafka = new Kafka({
  clientId: "taskOutboxReader",
  brokers: ["localhost:9092"],
});

async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker" });
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC_NAME });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });
      await new Promise((r) => setTimeout(r, 3000));

      console.log(`Processing done`);

      await consumer.commitOffsets([
        {
          topic: TOPIC_NAME,
          partition: partition,
          offset: (parseInt(message.offset) + 1).toString(),
        },
      ]);
    },
  });
}

main();
