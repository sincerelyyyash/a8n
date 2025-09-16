import type { Request, Response } from "express";
import { registerUserSchema, loginUserSchema } from "../types/user.types";
import { prisma } from "@repo/db"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


const JWT_SECRET = process.env.JWT_SECRET ?? "secret_token"

export const registerUser = async (req: Request, res: Response) => {

  const { success, data } = registerUserSchema.safeParse(req.body);

  if (!data || !success) {
    return res.status(400).json({
      mesage: "Invalid inputs, please try again."
    })
  }
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data?.email
    }
  })


  if (existingUser) {
    return res.status(400).json({
      message: "User already exists"
    })
  }

  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);


    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data?.firstName,
        lastName: data?.lastName
      }
    })

    if (!user) {
      return res.status(400).json({
        message: "Failed to create user"
      })
    }

    const userId = user.id
    const token = jwt.sign({ userId }, JWT_SECRET)

    return res.status(200).cookie("token", token,
      { expires: new Date(Date.now() + 86400000) }).json({
        message: "User created successfully",
        data: { user, token }
      })

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      data: (error as Error).message,
    })
  }

}


export const loginUser = async (req: Request, res: Response) => {

  const { success, data } = loginUserSchema.safeParse(req.body);

  if (!data || !success) {
    return res.status(400).json({
      message: " Invalid inputs, please try again."
    })
  }

  try {


    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (!user) {
      return res.status(400).json({
        message: "User does not exist"
      })
    }

    const isPasswordValid = bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials"
      })
    }

    const userId = user.id;
    const token = jwt.sign({ userId }, JWT_SECRET);

    return res.status(200)
      .cookie("token", token)
      .json({
        message: "User logged in successfully",
        data: token,
      })

  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      data: (err as Error).message,
    })
  }
}

export const getUser = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId)
      }
    })

    if (!user) {
      return res.status(403).json({
        message: "user not found"
      })
    }

    return res.status(200).json({
      message: "User fetched successfully",
      data: user
    });

  } catch (err) {

    return res.status(500).json({
      message: "Internal server error",
      data: (err as any).message,
    })

  }
}
