import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z.string(),
  title: z.string(),
  enabled: z.boolean(),

  nodes: z.array(z.object({
    id: z.string(),
    positionX: z.string(),
    positionY: z.string(),
  })),

  connection: z.array(z.object({
    fromId: z.string(),
    toId: z.string(),
  }))

})


export const updateWorkflowSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  enabled: z.boolean().optional(),

  nodes: z.array(z.object({
    id: z.string(),
    positionX: z.string(),
    positionY: z.string(),
  })).optional(),

  connection: z.array(z.object({
    fromId: z.string(),
    toId: z.string(),
  })).optional(),

})

export const deleteWorkflowSchema = z.object({
  id: z.string(),
})

export const getWorkflowSchema = z.object({
  id: z.string(),
})
