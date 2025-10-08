import { Router } from "express";
import { authMiddleware } from "../middleware";
import { TaskCreateSchema, TaskUpdateSchema } from "@repo/types";
import { PrismaClient } from "@prisma/client";

const router = Router();
const client = new PrismaClient();

router.post("/add", async (req, res) => {
  const body = req.body;

  const parsedData = TaskCreateSchema.safeParse(body);

  if (!parsedData.success)
    return res.status(411).json({
      message: "Invalid body",
    });
  const userId = req.headers["x-user-id"];

  const task = await client.task.create({
    data: {
      userId: userId,
      trigger: {
        create: {
          triggerId: parsedData.data.trigger.availableTriggerId,
         
        },
      },
      action: {
        create: parsedData.data.actions.map((x, index) => ({
          actionId: x.availableActionId,
          sortingOrder: index,
           metadata: x.actionMetadata
        })),
      },
    },
  });
  return res.json({
    task,
  });
});

router.get("/getTasks", authMiddleware, async (req, res) => {
  console.log("Auth. ", req.headers.authorization);
  const userId: number = req.userId;
  const tasks = await client.task.findMany({
    where: {
      userId: userId,
      markedasDelete:false
    },
    include: {
      trigger: {
        include: {
          type: true,
        },
      },
      action: {
        include: {
          action: true,
        },
        orderBy: {
          sortingOrder: "asc",
        },
      },
    },
  });

  return res.json({
    tasks,
  });
});

router.get("/getTasks/:getTask", authMiddleware, async (req, res) => {
  const taskId = req.params.getTask;

  const task = await client.task.findMany({
    where: {
      id: taskId,
    },
    include: {
      trigger: {
        include: {
          type: true,
        },
      },
      action: {
        include: {
          action: true,
        },
        orderBy: {
          sortingOrder: "asc",
        },
      },
    },
  });
  return res.json({
    task,
  });
});

router.delete(
  "/:taskId",
  authMiddleware,
  async (req, res) => {
    const taskId = req.params.taskId;
    try {
      const deleteTask = await client.task.update({
        where: {
          id: taskId,
        },
        data: {
          markedasDelete:true
        }
      });
      console.log(deleteTask);
      
      if (deleteTask)
        return res.json({
          task: taskId,
          message: "Task deleted",
        });
      else {
        throw new Error();
      }
    } catch (e) {
      return res.json({
        task: taskId,
        message: "deletion failed",
      });
    }
  }
);


router.post("/update", async (req, res) => {
  const body = req.body;

  const parsedData = TaskUpdateSchema.safeParse(body);

  if (!parsedData.success)
    return res.status(411).json({
      message: "Invalid body",
    });
  const userId = req.headers["x-user-id"];

await client.action.deleteMany({
  where: { taskId: parsedData.data.id.taskId },
});

  const task = await client.task.update({
    where: {
      userId: parsedData.data.id.userId,
      id: parsedData.data.id.taskId,
    },
    data: {
      trigger: {
        connect: {
          id: parsedData.data.trigger.availableTriggerId,
        },
      },
      action: {
        create: parsedData.data.actions.map((x, index) => ({
          actionId: x.availableActionId,
          sortingOrder: index,
          metadata: x.actionMetadata,
        })),
      },
    },
  });
  return res.json({
    task,
  });
});
export const taskRouter = router;
