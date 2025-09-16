import { Router } from "express";
import { getUser, loginUser, registerUser } from "../controllers/user.controller"
import { verifyJWT } from "../middlewares/auth.middleware";


const router = Router()

router.route("/signup").post(registerUser);
router.route("/signin").post(loginUser);

router.route("/").get(verifyJWT, getUser);

export default router;
