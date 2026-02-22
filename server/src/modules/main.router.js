import { Router } from "express";
import careerRoute from "./careers/career.route.js";

const router = Router();

router.use("/career", careerRoute);

export default router;
