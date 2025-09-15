import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createWorkflow, deleteWorkflow, getAllWorkflows, getWorkflow, updateWorkflow } from "../controllers/workflow.controller";

const router = Router();

router.route("/").get(verifyJWT, getWorkflow);
router.route("/all").get(verifyJWT, getAllWorkflows);

router.route("/").post(verifyJWT, createWorkflow);
router.route("/update").post(verifyJWT, updateWorkflow);

router.route("/delete").delete(verifyJWT, deleteWorkflow);

export default router;
