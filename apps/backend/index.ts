import express from "express";
import { userRouter } from "./router/userRouter";
import { taskRouter } from "./router/taskRouter";
import cors from "cors";
import { triggerRouter } from "./router/triggerRouter";
import { actionRouter } from "./router/actionRouter";

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url,req.body);
  next();
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`backend server is running on`, PORT);
});
