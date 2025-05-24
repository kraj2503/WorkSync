import type { Request,Response,NextFunction } from "express";
import { verifyJwt } from "./jwt";

export interface AuthRequest extends Request {
  email:string,
  name:string
}

interface JwtPayload {
  id: number;
  name: string;
  email: string;
}

export function authMiddleware(req:AuthRequest, res:Response, next:NextFunction){
    const token = req.headers.authorization as unknown as string;
    try{
        const payload = verifyJwt(token) as JwtPayload;
        req.email = payload.email;
        req.name = payload.name;
        next()

    }
    catch(e){
        return res.status(403).json({
            message:"unauthorized"
        })
    }

}