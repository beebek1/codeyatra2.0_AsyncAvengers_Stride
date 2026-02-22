import { Router } from "express";
import { registerUser, login , getMe} from "./auth.controller.js";
import authGuard from "../../middleware/authGuard.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/getme", authGuard, getMe);

export default router;