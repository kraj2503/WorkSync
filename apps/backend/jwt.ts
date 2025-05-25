import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const JWT_SECRET_KEY = "mysecret";

const salt = await bcrypt.genSalt(10);
export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

export const verifyPassword = async (password: string, hash: string) => {
  const res = await bcrypt.compare(password, hash);
  return res;
};

export const signJWT = (user: any) => {
  console.log(`user:  `,user);
  
  const token = jwt.sign(
    {
      userId:user.userId,
    },
    JWT_SECRET_KEY,
    { expiresIn: "2 days" }
  );

  return token;
};


export const verifyJwt=(paylaod:string)=>{
  const isValid  = jwt.verify(paylaod,JWT_SECRET_KEY) as JwtPayload;
  return isValid;
}

// verifyJwt("eyJhbGciO3JIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRlc3RVc2VyMiIsImVtYWlsIjoidGVzdHVzZXIxQGdtYWlsLmNvbSIsInZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNzQ4MDM1NjYwLCJleHAiOjE3NDgyMDg0NjB9.-Sf11Shbs70gAV_pFf01LekcXdrVjwEJekQ1-S8fXr8")
