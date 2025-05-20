import express from "express"

const app = express();



app.post("/hooks/catch/:userId/:taskId",(req,res)=>{

    const userId = req.params.userId;
    const taskId = req.params.taskId;



})