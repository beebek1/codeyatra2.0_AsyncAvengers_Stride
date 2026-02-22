import { Router } from "express";
import {
  createLevel,
  getAllLevels,
  getLevelsByCareer,
  updateLevel,
} from "./level.controller.js";

const router = Router();

// Create Level
router.post("/createlevels", createLevel);

// Get all levels
router.get("/getlevels", getAllLevels);

// Get levels by career
router.get("/career/:careerId", getLevelsByCareer);

// Update level
router.put("/update/:level_id", updateLevel);

export default router;