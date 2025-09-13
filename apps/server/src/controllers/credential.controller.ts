import type { Request, Response } from "express";
import { addCredentialSchema, updateCredentialSchema, getCredentialSchema, deleteCredentialSchema } from "../types/credential.types";
import { prisma } from "@repo/db"

export const addCredentials = async (req: Request, res: Response) => {

  const { success, data } = addCredentialSchema.safeParse(req.body);

  if (!success || !data) {
    return res.status(400).json({
      message: "Invalid inputs, try again."
    })
  }

  const userId = (req as any).user.id

  try {

    const cred = await prisma.credentials.create({
      data: {
        userId: userId,
        title: data.title,
        platform: data.platform,
        data: data.data
      }
    })

    if (!cred) {
      return res.status(400).json({
        message: "Failed to add credentials"
      })
    }

    return res.status(200).json({
      message: "credentials added successfully",
    })


  } catch (err) {
    return res.status(400).json({
      message: "Internal server error",
      data: (err as Error).message,
    })
  }
}


export const updateCredentials = async (req: Request, res: Response) => {

  const { success, data } = updateCredentialSchema.safeParse(req.body);

  if (!success || !data) {
    return res.status(200).json({
      message: "Invalid inputs"
    })
  }

  const userId = (req as any).user.id;

  try {

    const existingCredentials = await prisma.credentials.findUnique({
      where: {
        userId: parseInt(userId),
        id: parseInt(data.id)
      }
    })

    if (!existingCredentials) {
      return res.status(400).json({
        message: "credentials not found"
      })
    }

    const updatedCred = await prisma.credentials.update({
      where: {
        id: parseInt(data.id),
      },
      data: { data: data.data }
    })

    if (!updatedCred) {
      return res.status(400).json({
        message: "Failed to update credentials"
      })
    }

    return res.status(200).json({
      message: "Credentials updated successfully."
    })


  } catch (err) {
    return res.status(400).json({
      message: "Internal server error",
      data: (err as Error).message,
    })
  }

}


export const getAllCredentials = async (req: Request, res: Response) => {

  try {
    const userId = (req as any).user.id;

    const allCredentials = await prisma.credentials.findMany({
      where: {
        userId: parseInt(userId)
      }
    })

    if (!allCredentials) {
      return res.status(400).json({
        message: "could not get credentials"
      })
    }

    return res.status(200).json({
      message: "All Credentials fetched successfully.",
      data: allCredentials
    })

  } catch (err) {
    return res.status(400).json({
      message: "Internal server error",
      data: (err as Error).message,
    })
  }
}

export const getCredential = async (req: Request, res: Response) => {

  const { success, data } = getCredentialSchema.safeParse(req.body);

  if (!success || !data) {
    return res.status(400).json({
      messsage: "Invalid inputs",
    })
  }

  try {
    const userId = (req as any).user.id;

    const cred = await prisma.credentials.findUnique({
      where: {
        id: parseInt(userId),
        userId: parseInt(userId)
      }
    })


    if (!cred) {
      return res.status(400).json({
        message: "Credentials not found"
      })
    }

    return res.status(200).json({
      message: "Credential fetched successfully.",
      data: cred,
    })
  } catch (err) {

    return res.status(200).json({
      message: "Internal server error",
      data: (err as Error).message,
    })
  }

}

export const deleteCredential = async (req: Request, res: Response) => {

  const { success, data } = deleteCredentialSchema.safeParse(req.body);

  if (!success || !data) {
    return res.status(400).json({
      message: "Invalid inputs"
    })
  }

  try {

    const userId = (req as any).user.id;

    const deletedCred = await prisma.credentials.delete({
      where: {
        userId: parseInt(userId),
        id: parseInt(data.id),
      }
    })

    if (!deletedCred) {
      return res.status(400).json({
        message: "Failed to delete credentials"
      })
    }

    return res.status(200).json({
      message: "Credentials deleted successfully"
    })

  } catch (err) {

    return res.status(500).json({
      message: "Internal server error",
      data: (err as Error).message,
    })

  }
}
