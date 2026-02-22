import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTasksByLevel,
  updateTask,
} from "./task.controller.js";

const router = Router();

// Create Task
router.post("/createTask", createTask);

// Get all tasks
router.get("/getAllTasks", getAllTasks);

// Get tasks by level
router.get("/getTask/:level_id", getTasksByLevel);

// Update task
router.put("/updateTask/:id", updateTask);

export default router;