import Task from "./task.model.js";
import Level from "../levels/level.model.js";

/*
CREATE TASK
*/
export const createTask = async (req, res) => {
  console.log("Received request:", req.body);

  const { level_id, taskName, timeline } = req.body;

  // Validate input
  if (
    !level_id ||
    !Array.isArray(taskName) ||
    taskName.length === 0 ||
    (timeline && (!Array.isArray(timeline) || timeline.length !== taskName.length))
  ) {
    return res.status(400).json({
      success: false,
      message: "level_id and taskName (array) are required. If timeline is provided, it must match taskName length.",
    });
  }

  try {
    // Fetch level to get level_name
    const level = await Level.findByPk(level_id);
    if (!level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      });
    }

    // Determine task status based on level_name
    const defaultStatus = "locked";

    // Prepare tasks array with timeline and status
    const tasksToInsert = taskName.map((name, index) => ({
      level_id,
      taskName: name,
      timeline: timeline ? timeline[index] : 0, // use provided timeline or default 0
      status: defaultStatus,
    }));

    // Bulk create tasks
    const createdTasks = await Task.bulkCreate(tasksToInsert);

    return res.status(201).json({
      success: true,
      message: "Tasks created successfully",
      tasks: createdTasks,
    });

  } catch (error) {
    console.error("CreateTask Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create tasks",
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