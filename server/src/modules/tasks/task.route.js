import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTasksByLevel,
  getTasksWithStatusProgress,
  updateTask,
  updateTaskStatus,
} from "./task.controller.js";

const router = Router();

router.post("/createTask", createTask);
router.get("/getAllTasks", getAllTasks);
router.get("/getTask/:level_id", getTasksByLevel);
router.put("/updateTask/:id", updateTask);
router.put("/:id/status", updateTaskStatus);  // ← this was unreachable before
router.get("/getProgressTasks",getTasksWithStatusProgress);

export default router;