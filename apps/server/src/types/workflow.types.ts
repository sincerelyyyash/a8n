import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z.string(),
  title: z.string(),
  enabled: z.boolean(),

  nodes: z.array(z.object({
    id: z.string(),
    positionX: z.string(),
    positionY: z.string(),
    data: z.object(),
  })),

  connections: z.array(z.object({
    fromId: z.string(),
    toId: z.string(),
  }))

})


export const updateWorkflowSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  title: z.string().optional(),
  enabled: z.boolean().optional(),

  nodes: z.array(z.object({
    id: z.string(),
    positionX: z.string(),
    positionY: z.string(),
    data: z.object(),
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
