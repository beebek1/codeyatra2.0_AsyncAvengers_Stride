import { Router } from "express";
import careerRoute from "./careers/career.route.js";
import authRoute from "./auth/auth.routes.js";
import interestRoute from "./interest/interest.routes.js";

const router = Router();

router.use("/career", careerRoute);
router.use("/auth", authRoute);
router.use("/interest", interestRoute);

export default router;
