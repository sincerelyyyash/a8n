import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createWorkflow } from "../controllers/workflow.controller";

const router = Router();

router.route("/create").post(verifyJWT, createWorkflow);

export default router;
