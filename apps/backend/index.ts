import express from "express";
import { userRouter } from "./router/userRouter";
import { taskRouter } from "./router/taskRouter";
import cors from "cors";

const app = express();
app.use(express.json())
app.use(cors());


app.use("/api/v1/user",userRouter);
app.use("/api/v1/task",taskRouter);

const PORT = 3000

app.listen(PORT,()=>{
    console.log(`backend server is running on`,PORT)
    
});






