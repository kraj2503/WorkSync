import { Router } from "express";
import { authMiddleware } from "../middleware";
import { SignUpSchema } from "@repo/types";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../hashPassword";
const router = Router();

const client = new PrismaClient();

router.post("/signup", async (req, res) => {
  const body = req.body;
  const parsedData = SignUpSchema.safeParse(body);
  if (!parsedData.success ) {
     return res.status(411).json({
      message: "Wrong Inputs",
    });
  }

  const userExists = await client.user.findFirst({
    where: {
      name: parsedData.data?.userName,
    },
  });
  if (userExists) return res.status(411).json({ message: "User already exists" });

  const password = await hashPassword(parsedData.data.password)
 
  const createUser = await client.user.create({
    data:{
        name:parsedData.data.userName,
        password:password,
        email: parsedData.data.email
    }
  })

//   await sendEmail


  return res.status(200).json({"Message":"Please verify your email"})


});
router.post("/signin", (req, res) => {
  console.log(`SignIn Handler`);
});
router.get("/getUser", authMiddleware, (req, res) => {
  console.log(`get user`);
});

export const userRouter = router;