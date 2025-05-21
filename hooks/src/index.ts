import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

const client = new PrismaClient();

app.post("/hooks/catch/:userId/:taskId", async (req, res) => {
  const userId = req.params.userId;
  const taskId = req.params.taskId;
  const body = req.body;


  await client.$transaction(async (tx) => {
    const run = await client.taskRun.create({
      data: {
        taskId: taskId,
        metadata:body
      },
    });

    await client.taskRunOutbox.create({
      data: {
        taskRunId: run.id,
      },
    });
  });
  res.send({
    "posted":"taskoutbox"
  })
});

app.listen(3000);
