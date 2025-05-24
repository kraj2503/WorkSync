import type { Request,Response,NextFunction } from "express";
import { verifyJwt } from "./jwt";

interface AuthRequest extends Request {
  id?: string;
}


export function authMiddleware(req:AuthRequest, res:Response, next:NextFunction){
    const token = req.headers.authorization as unknown as string;
    try{
        const payload = verifyJwt(token)

        req.id= payload.id
        next()

    }
    catch(e){
        return res.status(403).json({
            message:"unauthorized"
        })
    }

}