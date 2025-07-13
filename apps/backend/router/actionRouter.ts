import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const client = new PrismaClient();


router.get("/available", async (req, res) => {
 
    const actions = await client.availableAction.findMany({})

    res.json(
        actions
    )
});

export const actionRouter = router