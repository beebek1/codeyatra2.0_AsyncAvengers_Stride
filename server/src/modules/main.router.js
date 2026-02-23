import { Router } from "express";
import careerRoute from "./careers/career.route.js";
import authRoute from "./auth/auth.routes.js";
import interestRoute from "./interest/interest.routes.js";
import levelRoute from "./levels/level.route.js";
import taskRoute from "./tasks/task.route.js";
import geminiRoute from "./gemini/gemini.routes.js";

const router = Router();

router.use("/career", careerRoute);
router.use("/auth", authRoute);
router.use("/interest", interestRoute);
router.use("/level",levelRoute);
router.use("/task",taskRoute);
router.use("/gemini",geminiRoute);

export default router;
