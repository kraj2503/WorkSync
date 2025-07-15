import z from "zod";
import type { email } from "zod/v4";

export const SignUpSchema = z.object({
  userName: z.string().min(5),
  password: z.string().min(5),
  email: z.string().email(),
});
export const SignInSchema = z.object({
 email: z.string().email(),
  password: z.string(),
});

export const TaskCreateSchema = z.object({
  trigger: z.object({
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional()
  }),
  actions: z.array(
    z.object({
      availableActionId: z.string(),
      order: z.number(),
      actionMetadata:z.any().optional()
    })
  ),
});
