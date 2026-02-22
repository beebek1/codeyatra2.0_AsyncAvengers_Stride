import Task from "./task.model.js";
import Level from "./level.model.js";

/*
CREATE TASK
*/
export const createTask = async (req, res) => {
  const { level_id, taskName } = req.body;

  if (!level_id || !taskName) {
    return res.status(400).json({
      success: false,
      message: "level_id and taskName are required",
    });
  }

  try {
    // Optional: check if level exists
    const levelExists = await Level.findByPk(level_id);
    if (!levelExists) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      });
    }

    const newTask = await Task.create({
      level_id,
      taskName,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};


/*
GET ALL TASKS
*/
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};


/*
GET TASKS BY LEVEL
*/
export const getTasksByLevel = async (req, res) => {
  const { level_id } = req.params;

  try {
    const tasks = await Task.findAll({
      where: { level_id },
    });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};


/*
UPDATE TASK
*/
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { taskName } = req.body;

  try {
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.update({ taskName });

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};