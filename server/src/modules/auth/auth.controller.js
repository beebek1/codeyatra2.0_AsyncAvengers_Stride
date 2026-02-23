import bcrypt from "bcrypt";
import User from "./auth.models.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/token.js";
import Interest from "../interest/interest.models.js"; // used for eager loading

// ==============================
// Register User
// ==============================
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password are required",
    });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ==============================
// Login User
// ==============================
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password are required",
    });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      userId: user.id,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ==============================
// Get Logged-in User (with Interests)
// ==============================
export const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User not found in token",
      });
    }

    // Fetch user and associated interests
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Interest,
          as: "interests", // MUST match association alias
          attributes: ["interests", "educationLevel", "description"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Take first interest record if exists
    const userInterest = user.interests?.[0] || null;

    const responseData = {
      ...user.toJSON(),
      educationLevel: userInterest?.educationLevel || "Not set",
      primaryInterest: userInterest?.interests?.[0] || "Not set",
      allInterests: userInterest?.interests || [],
      description: userInterest?.description || null,
    };

    return res.status(200).json({
      success: true,
      user: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user info",
      error: error.message,
    });
  }
};