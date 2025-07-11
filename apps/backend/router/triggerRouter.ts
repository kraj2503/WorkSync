import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const client = new PrismaClient();

router.get("/available", async (req, res) => {
  const availableTriggers = await client.availableTrigger.findMany({});

  res.json(
    availableTriggers
  );
});

export const triggerRouter = router;
