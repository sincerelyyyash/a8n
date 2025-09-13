import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addCredentials, deleteCredential, getAllCredentials, getCredential, updateCredentials } from "../controllers/credential.controller";

const router = Router();


router.route("/all").get(verifyJWT, getAllCredentials)
router.route("/").get(verifyJWT, getCredential)

router.route("/create").post(verifyJWT, addCredentials)
router.route("/update").post(verifyJWT, updateCredentials)

router.route("/delete").delete(verifyJWT, deleteCredential)

export default router;
