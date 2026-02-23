import Task from "./task.model.js";
import Level from "../levels/level.model.js";
import Career from "../careers/career.model.js";

// ==============================
// CREATE TASKS
// ==============================
export const createTask = async (req, res) => {
  const { level_id, taskName, timeline } = req.body;

  if (
    !level_id ||
    !Array.isArray(taskName) ||
    taskName.length === 0 ||
    (timeline && (!Array.isArray(timeline) || timeline.length !== taskName.length))
  ) {
    return res.status(400).json({
      success: false,
      message: "level_id and taskName (array) are required.",
    });
  }

  try {
    const level = await Level.findByPk(level_id);
    if (!level) {
      return res.status(404).json({ success: false, message: "Level not found" });
    }

    const tasksToInsert = taskName.map((name, index) => ({
      level_id,
      taskName: name,
      timeline: timeline ? timeline[index] : 0,
      status: "incomplete",
    }));

    const createdTasks = await Task.bulkCreate(tasksToInsert);

    return res.status(201).json({ success: true, message: "Tasks created successfully", tasks: createdTasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create tasks", error: error.message });
  }
};

// ==============================
// GET ALL TASKS
// ==============================
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [{ model: Level, as: "level", include: [{ model: Career, as: "career", attributes: ["id", "title", "industry"] }] }],
    });
    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch tasks", error: error.message });
  }
};

// ==============================
// GET TASKS BY LEVEL
// ==============================
export const getTasksByLevel = async (req, res) => {
  const { level_id } = req.params;
  try {
    const tasks = await Task.findAll({
      where: { level_id },
      include: [{ model: Level, as: "level", include: [{ model: Career, as: "career", attributes: ["id", "title", "industry"] }] }],
    });
    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch tasks", error: error.message });
  }
};

// ==============================
// UPDATE TASK — ✅ now handles both taskName AND status
// ==============================
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { taskName, status } = req.body;

  const allowedStatus = ["completed", "incomplete", "progress"];

  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const updateData = {};
    if (taskName) updateData.taskName = taskName;
    if (status && allowedStatus.includes(status)) updateData.status = status;

    await task.update(updateData);

    return res.status(200).json({ success: true, message: "Task updated successfully", task });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update task", error: error.message });
  }
};

// ==============================
// UPDATE TASK STATUS (dedicated endpoint — keep for future use)
// ==============================
export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = ["completed", "incomplete", "progress"];

  if (!status || !allowedStatus.includes(status)) {
    return res.status(400).json({ success: false, message: "Valid status required: completed, incomplete, progress" });
  }

  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await task.update({ status });

    return res.status(200).json({ success: true, message: "Task status updated successfully", task });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update task status", error: error.message });
  }
};