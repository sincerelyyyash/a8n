import { z } from "zod";

export const webhookHandlerSchema = z.object({
  name: z.string()
})
