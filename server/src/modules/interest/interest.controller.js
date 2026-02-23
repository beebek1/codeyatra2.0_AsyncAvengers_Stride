import Interest from "./interest.models.js";

// Add multiple interests for a user
export const addInterest = async (req, res) => {
    console.log("🔥 HIT CONTROLLER");

  console.log("BODY RECEIVED:", req.body);
  const {  interests, description, educationLevel } = req.body;

  if ( !interests || !Array.isArray(interests) || interests.length === 0) {
    return res.status(400).json({
      success: false,
      message: "userId and interests array are required",
    });
  }
  if(!req.user || !req.user.userId){
    return res.status(401).json({
      success: false,
      message: "Unauthorized: User not authenticated",
    });
  }

  try {
    const newInterest = await Interest.create({
      userId: req.user.userId, // Get userId from authenticated user
      interests,
      description,
      educationLevel,
    });

    return res.status(201).json({
      success: true,
      message: "Interest added successfully",
      interest: newInterest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add interest",
      error: error.message,
    });
  }
};

// Get all interests of a user
export const getUserInterests = async (req, res) => {
  const { userId } = req.params;

  try {
    const interests = await Interest.findAll({ where: { userId } });

    return res.status(200).json({
      success: true,
      interests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interests",
      error: error.message,
    });
  }
};