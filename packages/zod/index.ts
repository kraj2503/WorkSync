import z from "zod";

export const SignUpSchema = z.object({
  userName: z.string().min(5),
  password: z.string().min(5),
  email: z.string().email(),
});
export const SignInSchema = z.object({
  userName: z.string(),
  password: z.string(),
});
