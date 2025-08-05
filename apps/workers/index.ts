import { Kafka } from "kafkajs";
import { TOPIC_NAME } from "@repo/config";
import { PrismaClient } from "@prisma/client";

const kafka = new Kafka({
  clientId: "taskOutboxReader",
  brokers: ["localhost:9092"],
});
const prismaClient = new PrismaClient();

async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker" });
  await consumer.connect();
  const producer = kafka.producer();
  await producer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });
      if (!message.value?.toString()) {
        return;
      }

      const parsedValue = JSON.parse(message.value?.toString());

      const taskRunId = parsedValue.taskRunId;
      const stage = parsedValue.stage;

      const taskRundetails = await prismaClient.taskRun.findFirst({
        where: {
          id: taskRunId,
        },
        include: {
          task: {
            include: {
              action: {
                include: {
                  action: true,
                },
              },
            },
          },
        },
      });

      const currentStage = taskRundetails?.task.action.find(
        (x) => x.sortingOrder === stage
      );

      if (!currentStage) {
        console.log(`"Current action not found`);
      }
console.log(currentStage?.action.id);

      if (currentStage?.action.id === "email") {
        console.log("Sending out email");
      }

      if (currentStage?.action.id === "solana") {
        console.log("Sending out solana");
      }
      const lastStage = (taskRundetails?.task.action.length || 1) - 1;
      if (lastStage !== stage) {
        await producer.send({
          topic: TOPIC_NAME,
          messages: [
            {
              value: JSON.stringify({
                stage: stage + 1,
                taskRunId,
              }),
            },
          ],
        });
      }
      await new Promise((r) => setTimeout(r, 500));

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
