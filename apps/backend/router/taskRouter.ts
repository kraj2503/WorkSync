import { Router } from "express";
import { authMiddleware } from "../middleware";

const router =Router();


router.post("/add",authMiddleware,(req,res)=>{
    console.log(`add task Handler`);
    
});
router.get("/getTasks",authMiddleware,(req,res)=>{
    console.log(`getTask Handler`);
    
});
router.get("/:getTasks",authMiddleware,(req,res)=>{
    console.log(`getTask Handler`);
    
});







export const taskRouter = router;
