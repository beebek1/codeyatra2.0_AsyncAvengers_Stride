import { Router } from "express";
import {
  getAllCareers,
  getCareerById,
  createCareer,
} from "../careers/career.controller.js";

const router = Router();

router.get("/", getAllCareers);
router.get("/:id", getCareerById);
router.post("/createCareer", createCareer);

export default router;
