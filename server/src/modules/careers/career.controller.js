import Career from "./career.model.js";
import Level from "../levels/level.model.js";
import Task from "../tasks/task.model.js";

// ==============================
// 1. Get all careers (with optional filtering by industry)
// Include Levels and Tasks
// ==============================
export const getAllCareers = async (req, res) => {
  try {
    const { industry } = req.query;
    const filter = industry ? { where: { industry } } : {};

    const careers = await Career.findAll({
      ...filter,
      include: [
        {
          model: Level,
          as: "levels", // match association alias
          include: [
            {
              model: Task,
              as: "tasks", // match association alias
            },
          ],
        },
      ],
    });

    // Convert Sequelize instances to plain objects
    const careersData = careers.map(career => career.toJSON());

    return res.status(200).json({
      success: true,
      count: careersData.length,
      data: careersData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// 2. Get a single career's details
// Include Levels and Tasks
// ==============================
export const getCareerById = async (req, res) => {
  try {
    const career = await Career.findByPk(req.params.id, {
      include: [
        {
          model: Level,
          as: "levels",
          include: [
            {
              model: Task,
              as: "tasks",
            },
          ],
        },
      ],
    });

    if (!career) {
      return res
        .status(404)
        .json({ success: false, message: "Career not found" });
    }

    return res.status(200).json({ success: true, data: career });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// 3. Admin: Add a new career
// ==============================
export const createCareer = async (req, res) => {
  try {
    const { title, description, industry, avg_salary, difficulty, tags, sponsorship_link } = req.body;

    const newCareer = await Career.create({
      title,
      description,
      industry,
      avg_salary,
      difficulty,
      tags,
      sponsorship_link,
    });

    return res.status(201).json({ success: true, data: newCareer });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ success: false, message: "Career title already exists" });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};