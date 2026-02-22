import Career from "./career.model.js";

// 1. Get all careers (with optional filtering by industry)
export const getAllCareers = async (req, res) => {
  try {
    const { industry } = req.query;
    const filter = industry ? { where: { industry } } : {};

    const careers = await Career.findAll(filter);

    return res.status(200).json({
      success: true,
      count: careers.length,
      data: careers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get a single career's details
export const getCareerById = async (req, res) => {
  try {
    const career = await Career.findByPk(req.params.id);

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

// 3. Admin: Add a new career (Useful for your seed script or Postman)
export const createCareer = async (req, res) => {
  try {
    const { title, description, industry, avg_salary, difficulty, tags } =
      req.body;

    const newCareer = await Career.create({
      title,
      description,
      industry,
      avg_salary,
      difficulty,
      tags,
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
