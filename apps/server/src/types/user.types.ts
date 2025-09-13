import { z } from "zod";


export const registerUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(12),
  firstName: z.string(),
  lastName: z.string(),
})

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(12)
})
