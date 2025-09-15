import type { Request, Response } from "express";
import { createWorkflowSchema, deleteWorkflowSchema, getWorkflowSchema, updateWorkflowSchema } from "../types/workflow.types";
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


      for (const node of data.nodes ?? []) {
        await tx.node.create({
          data: {
            positionX: parseFloat(node.positionX),
            positionY: parseFloat(node.positionY),
            workflowId: workflow.id,
          },
        });
      }


      for (const connection of data.connections ?? []) {
        await tx.connection.create({
          data: {
            fromId: parseInt(connection.fromId),
            toId: parseInt(connection.toId),
            workflowId: workflow.id,
          },
        });
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


export const updateWorkflow = async (req: Request, res: Response) => {
  const { success, data, error } = updateWorkflowSchema.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Invalid inputs",
      issues: error.issues,
    });
  }

  try {
    const userId = (req as any).user.id;

    const workflow = await prisma.workflow.findFirst({
      where: {
        id: parseInt(data.id),
        userId: parseInt(userId),
      },
    });

    if (!workflow) {
      return res.status(404).json({
        message: "Workflow does not exist or you don't have access.",
      });
    }

    const updatedWorkflow = await prisma.$transaction(async (tx) => {

      const wf = await tx.workflow.update({
        where: { id: workflow.id },
        data: {
          name: data.name ?? workflow.name,
          title: data.title ?? workflow.title,
          enabled: data.enabled ?? workflow.enabled,
        },
      });


      if (data.nodes) {
        await tx.node.deleteMany({
          where: { workflowId: workflow.id },
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
      }


      if (data.connection) {
        await tx.connection.deleteMany({
          where: { workflowId: workflow.id },
        });

        for (const connection of data.connection) {
          await tx.connection.create({
            data: {
              fromId: parseInt(connection.fromId),
              toId: parseInt(connection.toId),
              workflowId: workflow.id,
            },
          });
        }
      }

      return wf;
    });

    return res.status(200).json({
      message: "Workflow updated successfully",
      workflow: updatedWorkflow,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message,
    });
  }
};


export const getAllWorkflows = async (req: Request, res: Response) => {

  const userId = (req as any).user.id;

  try {
    const allWorkflows = await prisma.workflow.findMany({
      where: {
        userId: parseInt(userId),
      }
    })

    if (!allWorkflows) {
      return res.status(403).json({
        message: "No workflows or you do not have access"
      })
    }

    return res.status(200).json({
      message: "Workflows fetched successfully.",
      data: allWorkflows,
    })

  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      data: (err as Error).message,
    })
  }

}

export const getWorkflow = async (req: Request, res: Response) => {
  const { success, data } = getWorkflowSchema.safeParse(req.body);
  if (!success || !data) {
    return res.status(411).json({
      message: " Invalid inputs"
    })
  }

  try {
    const userId = (req as any).user.id;

    const workflow = await prisma.workflow.findFirst({
      where: {
        userId: parseInt(userId),
        id: parseInt(data.id)
      }
    })

    if (!workflow) {
      return res.status(403).json({
        message: "Workflow not found or you do not have access."
      })
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      data: (err as Error).message,
    })
  }
}

export const deleteWorkflow = async (req: Request, res: Response) => {
  const { success, data } = deleteWorkflowSchema.safeParse(req.body);

  if (!success || !data) {
    return res.status(411).json({
      message: "Invalid inputs"
    })
  }

  try {
    const userId = (req as any).user.id;

    const deletedWorkflow = await prisma.$transaction(async (tx) => {

      const deletedWorkflow = await tx.workflow.delete({
        where: {
          id: parseInt(data.id),
          userId: parseInt(userId),
        }
      })

      await tx.node.deleteMany({
        where: {
          workflowId: parseInt(data.id),
        }
      })

      await tx.connection.deleteMany({
        where: {
          workflowId: parseInt(data.id),
        }
      })

      return deletedWorkflow;
    })

    if (!deletedWorkflow) {
      return res.status(403).json({
        message: "Failed to delete workflow"
      })
    }

    return res.status(200).json({
      message: "Workflow deletion successfull"
    })

  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      data: (err as Error).message,
    })
  }
}
