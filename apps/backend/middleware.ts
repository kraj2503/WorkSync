import type { Request,Response,NextFunction } from "express";
import { verifyJwt } from "./jwt";

export interface AuthRequest extends Request {
 userId:number,
}

interface JwtPayload {
  userId: number;
}

export function authMiddleware(req:AuthRequest, res:Response, next:NextFunction){
    const token = req.headers.authorization as unknown as string;
    try{
        const payload = verifyJwt(token) as JwtPayload;       
        req.userId=payload.userId;
        next()

    }
    catch(e){
        return res.status(403).json({
            message:"unauthorized"
        })
    }

}