import { Router, type Request, type Response } from "express";
import { authMiddleware } from "../middleware";
import { SignInSchema, SignUpSchema } from "@repo/types";
import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword, signJWT } from "../jwt";

const router = Router();

const client = new PrismaClient();

router.post("/signup", async (req, res) => {
  const body = req.body;
  const parsedData = SignUpSchema.safeParse(body);
  if (!parsedData.success) {
    return res.status(411).json({
      message: "Wrong Inputs",
    });
  }

  const userExists = await client.user.findFirst({
    where: {
      name: parsedData.data?.userName,
    },
  });
  if (userExists)
    return res.status(411).json({ message: "User already exists" });

  const password = await hashPassword(parsedData.data.password);

  const createUser = await client.user.create({
    data: {
      name: parsedData.data.userName,
      password: password,
      email: parsedData.data.email,
    },
  });
  console.log(`${createUser}`);

  if (createUser) {
    const token = signJWT(createUser);

    //   await sendEmail

    return res.status(200).json({ Message: "Please verify your email", token });
  }
});

router.post("/signin", async (req:Request, res:Response) => {
  const body = req.body;
  const parsedData = SignInSchema.safeParse(body);
  if (!parsedData.success) {
    return res.status(411).json({
      message: "Wrong Inputs",
    });
  }

  const userExists = await client.user.findFirst({
    where: {
      name: parsedData.data?.userName,
    },
  });
  if (!userExists) return res.status(403).json({ message: "Invalid Username" });

  const auth = await verifyPassword(
    parsedData.data.password,
    userExists.password
  );

  if (!auth) {
    return res.status(403).json({ message: "Invalid Password" });
  }

  const token = signJWT(userExists);

  return res.status(200).json({ token });
});

router.get("/getUser/:id", authMiddleware, async (req, res) => {
  const userId = req.params.id;
  if (!userId)
    return res.status(411).json({
      message: "user id not sent",
    });
  const userExists = await client.user.findFirst({
    where: {
      userId: parseInt(userId),
    },
    select: {
      name: true,
      email: true,
    },
  });

  if (!userExists)
    return res.status(404).json({
      messgae: "User not Found",
    });


    return res.json({
      userExists
    })
});

export const userRouter = router;
