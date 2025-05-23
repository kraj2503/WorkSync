import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";
import { TOPIC_NAME } from "@repo/config";

const client = new PrismaClient();
const kafka = new Kafka({
  clientId: "outBoxProcessor",
  brokers: ["localhost:9092"],
});

async function main() {
  const producer = kafka.producer();
  await producer.connect();

  while (1) {
    const pendingRows = await client.taskRunOutbox.findMany({
      take: 10,
    });
    

    producer.sendBatch({
        topicMessages: [
          {
            topic: TOPIC_NAME,
            messages: pendingRows.map((row) => ({
              value: row.taskRunId,
            })),
          },
        ],
      });
      await client.taskRunOutbox.deleteMany({
        where: {
          id: {
            in: pendingRows.map((r) => r.id),
          },
        },
      });
    }
  
}

main();
