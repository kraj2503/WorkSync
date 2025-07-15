import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

const client = new PrismaClient();

app.use(express.json());
app.post("/hooks/catch/:userId/:taskId", async (req, res) => {
  console.log("catch hook");
  
  const userId = req.params.userId;
  const taskId = req.params.taskId;
  const body = req.body;

  console.log(`body`, body);

  await client.$transaction(async () => {
    const run = await client.taskRun.create({
      data: {
        taskId: taskId,
        metadata: body,
      },
    });

    await client.taskRunOutbox.create({
      data: {
        taskRunId: run.id,
      },
    });
  });
  res.send({
    posted: "taskoutbox",
  });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Hooks server is running on`, PORT);
});
