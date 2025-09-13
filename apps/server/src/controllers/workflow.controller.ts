import type { Request, Response } from "express";
import { createWorkflowSchema } from "../types/workflow.types";
import { prisma } from "@repo/db";

export const createWorkflow = async (req: Request, res: Response) => {
  const { success, data, error } = createWorkflowSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "Invalid inputs",
      issues: error.issues,
    });
  }

  try {

    const userId = (req as any).user.id;

    const workflow = await prisma.$transaction(async (tx) => {

      const workflow = await tx.workflow.create({
        data: {
          name: data.name,
          title: data.title,
          enabled: data.enabled,
          userId: parseInt(userId),
        },
      });


      for (const node of data.nodes) {
        await tx.node.create({
          data: {
            positionX: parseFloat(node.positionX),
            positionY: parseFloat(node.positionY),
            workflowId: workflow.id,
          },
        });
      }

      for (const connection of data.connection) {
        await tx.connection.create({
          data: {
            fromId: parseInt(connection.fromId),
            toId: parseInt(connection.toId),
            workflowId: workflow.id,
          }
        })
      }

      return workflow;
    });

    return res.status(201).json({
      message: "Workflow created successfully",
      workflow,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message,
    });
  }
};

