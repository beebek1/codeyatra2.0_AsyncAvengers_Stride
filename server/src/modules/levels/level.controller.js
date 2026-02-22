import Level from "./level.model.js";
import Career from "../careers/career.model.js";

/*
CREATE LEVEL
*/
export const createLevel = async (req, res) => {
  const { level_name, careerId } = req.body;

  if (!level_name || !careerId) {
    return res.status(400).json({
      success: false,
      message: "level_name and careerId are required",
    });
  }

  try {
    // Optional: check if career exists
    const careerExists = await Career.findByPk(careerId);
    if (!careerExists) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    const newLevel = await Level.create({
      level_name,
      careerId,
    });

    return res.status(201).json({
      success: true,
      message: "Level created successfully",
      level: newLevel,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create level",
      error: error.message,
    });
  }
};


/*
GET ALL LEVELS
*/
export const getAllLevels = async (req, res) => {
  try {
    const levels = await Level.findAll();

    return res.status(200).json({
      success: true,
      levels,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch levels",
      error: error.message,
    });
  }
};


/*
GET LEVELS BY CAREER ID
*/
export const getLevelsByCareer = async (req, res) => {
  const { careerId } = req.params;

  try {
    const levels = await Level.findAll({
      where: { careerId },
    });

    return res.status(200).json({
      success: true,
      levels,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch levels",
      error: error.message,
    });
  }
};


/*
UPDATE LEVEL
*/
export const updateLevel = async (req, res) => {
  const { level_id } = req.params;
  const { level_name } = req.body;

  try {
    const level = await Level.findByPk(level_id);

    if (!level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      });
    }

    await level.update({ level_name });

    return res.status(200).json({
      success: true,
      message: "Level updated successfully",
      level,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update level",
      error: error.message,
    });
  }
};