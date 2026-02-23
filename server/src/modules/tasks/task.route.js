import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTasksByLevel,
  updateTask,
  updateTaskStatus,
} from "./task.controller.js";

const router = Router();

router.post("/createTask", createTask);
router.get("/getAllTasks", getAllTasks);
router.get("/getTask/:level_id", getTasksByLevel);
router.put("/updateTask/:id", updateTask);
router.put("/:id/status", updateTaskStatus);  // ← this was unreachable before

export default router;