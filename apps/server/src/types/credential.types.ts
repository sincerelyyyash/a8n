import { z } from "zod";


export const addCredentialSchema = z.object({
  title: z.string(),
  platform: z.string(),
  data: z.any(),
})

export const updateCredentialSchema = z.object({
  id: z.string(),
  data: z.any(),
})

export const deleteCredentialSchema = z.object({
  id: z.string(),
})

export const getCredentialSchema = z.object({
  id: z.string(),
})
